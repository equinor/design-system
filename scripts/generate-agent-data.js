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
 *   Storybook docs generator (scripts/component-docs/)
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
const {
  discoverPublicComponents,
  extractComponentData,
} = require('./generate-component-index')
const { rootDir, PLATFORMS } = require('./component-docs/config')
const {
  findPropsDeclaration,
  readFigmaUrl,
  docsPageUrl,
} = require('./component-docs/locate')
const { extractProps, extractBaseTypes } = require('./component-docs/props')
const { extractStories } = require('./component-docs/stories')
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

function readGuidance(dir, name) {
  const file = path.join(dir, `${name}.docs.md`)
  if (!fs.existsSync(file)) {
    return { summary: undefined, guidance: {}, links: {} }
  }
  const { sections, links } = readSidecar(file, web)
  const guidance = {}
  for (const [key, heading] of Object.entries(GUIDANCE_SECTIONS)) {
    if (sections[heading]) guidance[key] = sections[heading]
  }
  return { summary: sections.Summary, guidance, links }
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
  return extractStories(project, file, web.skipStories)
    .filter((story) => story.code)
    .map(({ title, caption, code }) => ({ title, caption, code }))
}

function buildComponent(project, entry) {
  const { name, dir } = entry
  const index = extractComponentData(entry)
  const { summary, guidance, links } = readGuidance(dir, name)
  const file = path.join(dir, `${name}.tsx`)
  const declaration = findProps(project, dir, name)
  const props = declaration ? extractProps(declaration) : []

  return {
    name,
    description: summary ?? index.description ?? null,
    status: index.status,
    importLine: web.importLine(name),
    hasAsChild: props.some((prop) => prop.name === 'asChild'),
    props,
    baseTypes: webBaseTypes(declaration),
    subComponents: index.subComponents,
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
  const components = discoverPublicComponents()
    .map((entry) => buildComponent(project, entry))
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
