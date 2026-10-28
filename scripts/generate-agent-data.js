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
 * - discovery, description, sub-components, asChild and status come from the
 *   component index generator (scripts/generate-component-index.js)
 * - props, examples and guidance come from the Storybook docs generator
 *   (scripts/component-docs/)
 *
 * A component without a `.docs.md` sidecar still gets props, sub-components and
 * examples, but no guidance and no summary. Its description falls back to the
 * JSDoc on the component, or `null` when that is missing too.
 *
 * `version` and the source links follow the beta release line
 * (`next/version.txt`, tagged `eds-core-react-next@v<version>`), not the
 * version in package.json: the build runs before the publish workflow sets the
 * beta version, and the data only covers the beta components.
 */

const fs = require('fs')
const path = require('path')
const { Project } = require('ts-morph')
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

// Every web component builds on a React DOM type. None found usually means
// React's types did not resolve, which also empties the props list, so the
// build stops instead of shipping incomplete data. The extractor also finds
// nothing for an interface that extends a React type, a qualified name such as
// `React.HTMLAttributes`, or `ComponentPropsWithoutRef<'button'>`.
function webBaseTypes(declaration, name) {
  const bases = extractBaseTypes(declaration, 'web')
  if (bases.length === 0) {
    fail(
      `${name}: no React DOM base type found. Either React's types did not resolve (run \`pnpm install\`), or the props use a shape the extractor does not handle (an interface, \`React.*\`, or \`ComponentProps*\`).`,
    )
  }
  // Nested Omits can name the same key twice.
  return bases.map(({ name: base, omitted }) => ({
    name: base,
    omitted: [...new Set(omitted)],
  }))
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
  const declaration = findPropsDeclaration(project, dir, name)

  return {
    name,
    description: index.description ?? summary ?? null,
    status: index.status,
    importLine: web.importLine(name),
    hasAsChild: index.hasAsChild,
    props: extractProps(declaration),
    baseTypes: webBaseTypes(declaration, name),
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
  const project = new Project({ skipAddingFilesFromTsConfig: true })
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
