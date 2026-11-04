#!/usr/bin/env node

/**
 * Generates the component data that `@equinor/eds-cli` reads, so an agent in a
 * product team's repository can look up the beta components in the version the
 * team has installed (ADR-0030).
 *
 * Output: packages/eds-core-react/build/agent/components.json. It is written at
 * build time and ships in the package through `files: ["build/*"]`; it is not
 * committed. The eds-core-react `build` script runs this after rollup, because
 * rollup empties build/ first.
 *
 * Nothing is parsed here that another generator already parses:
 * - discovery, description, sub-components and status come from the
 *   component index generator (scripts/generate-component-index.js)
 * - props (and asChild, read from them), examples and guidance come from the
 *   Storybook docs generator (scripts/component-docs/), and so do the props of
 *   each sub-component, through the same WEB_SUB_COMPONENTS map
 *
 * The description is the hand-written Summary in `.docs.md`, which is written
 * for readers. A component without a sidecar still gets props, sub-components
 * and examples, but no guidance, and its description falls back to the JSDoc on
 * the component, or `null` when that is missing too.
 *
 * `version` and the source links follow the beta release line
 * (`next/version.txt`, tagged `eds-core-react-next@v<version>`), not the
 * version in package.json: the build runs before the publish workflow sets the
 * beta version, and the data only covers the beta components.
 */

const fs = require('fs')
const path = require('path')
const { Node } = require('ts-morph')
const {
  discoverPublicComponents,
  extractComponentData,
} = require('./generate-component-index')
const {
  rootDir,
  PLATFORMS,
  WEB_SUB_COMPONENTS,
} = require('./component-docs/config')
const {
  findPropsDeclaration,
  readFigmaUrl,
  docsPageUrl,
} = require('./component-docs/locate')
const { extractProps, extractBaseTypes } = require('./component-docs/props')
const { extractStories } = require('./component-docs/stories')
const { toExample } = require('./agent-examples')
const { readSidecar } = require('./component-docs/sidecar')
const { createProject } = require('./component-docs/project')
const { DocsError, fail } = require('./component-docs/errors')

// Bump when the shape of components.json changes in a way the CLI must know
// about. The CLI refuses data with a schema version it does not support.
const SCHEMA_VERSION = 1

const web = PLATFORMS.web
const betaVersion = fs
  .readFileSync(path.join(rootDir, web.componentsRoot, 'version.txt'), 'utf8')
  .trim()
// Pinned to the release tag, so the link shows the code the consumer installed.
const sourceUrl = (file) =>
  `https://github.com/equinor/design-system/blob/eds-core-react-next@v${betaVersion}/${path.relative(rootDir, file)}`
const outputPath = path.join(
  rootDir,
  'packages/eds-core-react/build/agent/components.json',
)

const GUIDANCE_SECTIONS = {
  features: 'Features',
  usage: 'Usage',
  accessibility: 'Accessibility',
  related: 'Related components',
}

// Links between the docs pages are Storybook paths, such as
// `[TextField](?path=/docs/beta-inputs-textfield--docs)`, which lead nowhere
// outside Storybook. The link text names the component, which the agent looks up
// with `eds show`, so only the text is kept.
const STORYBOOK_LINK = /\[([^\]]+)\]\(\?path=[^)]*\)/g
const withoutStorybookLinks = (markdown) =>
  markdown?.replace(STORYBOOK_LINK, '$1')

function readGuidance(dir, name) {
  const file = path.join(dir, `${name}.docs.md`)
  if (!fs.existsSync(file)) {
    return { summary: undefined, guidance: {}, links: {} }
  }
  const { sections, links } = readSidecar(file, web)
  const guidance = {}
  for (const [key, heading] of Object.entries(GUIDANCE_SECTIONS)) {
    if (sections[heading]) {
      guidance[key] = withoutStorybookLinks(sections[heading])
    }
  }
  return { summary: withoutStorybookLinks(sections.Summary), guidance, links }
}

// Without `pnpm install`, React's types do not resolve, every DOM base type
// becomes `any` and the props lists come out empty without an error. Checking
// that once, directly, stops the build in that case without guessing from the
// shape of each props type.
function assertReactResolves(project) {
  const probe = project.createSourceFile(
    path.join(rootDir, web.componentsRoot, '__react-probe__.ts'),
    "import type { HTMLAttributes } from 'react'\nexport type Probe = HTMLAttributes<HTMLDivElement>\n",
    { overwrite: true },
  )
  const resolved =
    probe.getTypeAliasOrThrow('Probe').getType().getProperties().length > 0
  project.removeSourceFile(probe)
  if (!resolved) {
    fail(
      "React's types did not resolve, so every props list would be empty. Run `pnpm install`.",
    )
  }
}

// The React DOM types the props build on. Empty is fine: the extractor does not
// follow every shape (an interface, `React.*`, `ComponentProps*`), and the
// props themselves are still listed.
function webBaseTypes(declaration) {
  if (!declaration) return []
  // Nested Omits can name the same key twice.
  return extractBaseTypes(declaration, 'web').map(({ name, omitted }) => ({
    name,
    omitted: [...new Set(omitted)],
  }))
}

// Exports that are not components to render, so the CLI can say so instead of
// listing them next to Button and Field.
const UTILITIES = new Set(['Slot'])

// The first paragraph of a component's README, for a utility without a sidecar
// or JSDoc (Slot).
function readmeDescription(dir) {
  const file = path.join(dir, 'README.md')
  if (!fs.existsSync(file)) return undefined
  return fs
    .readFileSync(file, 'utf8')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find((paragraph) => paragraph && !paragraph.startsWith('#'))
}

// Hooks exported next to a component, such as `export { Field, useFieldIds }`,
// keyed by that component. The CLI shows them with it, because the hook is used
// with that component's parts.
function exportedHooks(project) {
  const barrel = project.addSourceFileAtPath(
    path.join(rootDir, web.componentsRoot, 'index.ts'),
  )
  const hooks = new Map()
  for (const declaration of barrel.getExportDeclarations()) {
    const names = declaration.getNamedExports().map((e) => e.getName())
    const owner = names.find((n) => /^[A-Z]/.test(n))
    const found = names.filter((n) => /^use[A-Z]/.test(n))
    if (owner && found.length) hooks.set(owner, found)
  }
  return hooks
}

const firstParagraph = (text) =>
  text
    .trim()
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ')

// A hook's signature, its description and the fields of what it returns, read
// from the exported function in the component's folder.
function readHook(project, dir, name) {
  const fn = project
    .getSourceFiles(`${dir}/**/*.{ts,tsx}`)
    .map((sf) => sf.getFunction(name))
    .find((f) => f?.isExported())
  if (!fn)
    fail(
      `${name}: no exported function ${name} in ${path.relative(rootDir, dir)}. Hooks are read from function declarations, so write it as \`export function ${name}\` rather than an arrow function.`,
    )
  const parameters = fn
    .getParameters()
    .map((p) => p.getText())
    .join(', ')
  const returnType = fn.getReturnTypeNode()
  const returnDeclaration = Node.isTypeReference(returnType)
    ? returnType.getTypeName().getSymbol()?.getDeclarations()[0]
    : undefined
  return {
    name,
    description: firstParagraph(fn.getJsDocs()[0]?.getDescription() ?? ''),
    importLine: web.importLine(name),
    signature: `${name}(${parameters})${returnType ? `: ${returnType.getText()}` : ''}`,
    returns: returnDeclaration ? extractProps(returnDeclaration) : [],
  }
}

// The type parameters of a generic props type, such as `T = string` for
// Autocomplete, so the agent knows that the props which name T take its own type.
const typeParameters = (declaration) =>
  declaration?.getTypeParameters?.().map((p) => p.getText()) ?? []

// A PascalCase export without a `{Name}Props` type, such as a context or a
// provider, gets an entry with no props instead of stopping the build.
function findProps(project, dir, name) {
  try {
    return findPropsDeclaration(project, dir, name)
  } catch (error) {
    if (error instanceof DocsError) return null
    throw error
  }
}

// Standalone components that share a folder (MenuItem in Menu/) have no
// stories file of their own.
function readExamples(project, dir, name) {
  const file = path.join(dir, `${name}.stories.tsx`)
  if (!fs.existsSync(file)) return []
  return extractStories(project, file, web.skipStories).flatMap((story) => {
    const code = toExample(story)
    return code ? [{ title: story.title, caption: story.caption, code }] : []
  })
}

// The index finds the parts of a compound component in its source, and
// WEB_SUB_COMPONENTS names the props type of each part. The build stops when the
// two disagree, so a new part cannot ship without its props.
function readSubComponents(project, dir, name, found) {
  // A standalone component shown on the parent's page, such as AvatarNameLabel
  // on Avatar's, has a dotless name and an entry of its own.
  const configured = (WEB_SUB_COMPONENTS[name] ?? []).filter((sub) =>
    sub.name.startsWith(`${name}.`),
  )
  const configuredNames = configured.map((sub) => sub.name)
  if (found.join() !== configuredNames.join()) {
    fail(
      `${name}: the component has the parts [${found.join(', ')}], but WEB_SUB_COMPONENTS in scripts/component-docs/config.js lists [${configuredNames.join(', ')}]. Update the config.`,
    )
  }
  return configured.map((sub) => {
    const declaration = findPropsDeclaration(project, dir, sub.component)
    return {
      name: sub.name,
      props: extractProps(declaration),
      baseTypes: webBaseTypes(declaration),
    }
  })
}

function buildComponent(project, entry, hooks) {
  const { name, dir } = entry
  const index = extractComponentData(entry, project)
  const { summary, guidance, links } = readGuidance(dir, name)
  const file = path.join(dir, `${name}.tsx`)
  const declaration = findProps(project, dir, name)
  const props = declaration ? extractProps(declaration) : []

  return {
    name,
    description: summary ?? index.description ?? readmeDescription(dir) ?? null,
    kind: UTILITIES.has(name) ? 'utility' : 'component',
    status: index.status,
    importLine: web.importLine(name),
    hasAsChild: props.some((prop) => prop.name === 'asChild'),
    props,
    typeParameters: typeParameters(declaration),
    baseTypes: webBaseTypes(declaration),
    subComponents: readSubComponents(project, dir, name, index.subComponents),
    hooks: (hooks.get(name) ?? []).map((hook) => readHook(project, dir, hook)),
    examples: readExamples(project, dir, name),
    guidance,
    links: {
      docs: docsPageUrl(name, links.docs),
      figma: readFigmaUrl(dir, name),
      aria: links.aria,
      source: fs.existsSync(file) ? sourceUrl(file) : undefined,
    },
  }
}

function buildAgentData() {
  // Loads every component up front, so props imported from another folder
  // (TextField's from Input) do not depend on the order of the barrel.
  const project = createProject()
  assertReactResolves(project)
  const hooks = exportedHooks(project)
  const components = discoverPublicComponents(project)
    .map((entry) => buildComponent(project, entry, hooks))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    schemaVersion: SCHEMA_VERSION,
    package: '@equinor/eds-core-react',
    version: betaVersion,
    installLine: web.installLine,
    components,
  }
}

function main() {
  try {
    const data = buildAgentData()
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`)
    console.log(
      `Wrote ${path.relative(rootDir, outputPath)} (${data.components.length} components).`,
    )
  } catch (error) {
    if (!(error instanceof DocsError)) throw error
    console.error(`generate-agent-data: ${error.message}`)
    process.exitCode = 1
  }
}

module.exports = { buildAgentData, SCHEMA_VERSION }

if (require.main === module) main()
