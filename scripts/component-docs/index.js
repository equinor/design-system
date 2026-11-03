const fs = require('fs')
const path = require('path')
const { rootDir } = require('./config')
const { createProject } = require('./project')
const { DocsError, fail } = require('./errors')
const { discoverComponents } = require('./locate')
const { buildPages } = require('./build')
const { assertStorybookSourceLinks } = require('./storybook')

// Writes the pages, or with `--check` only reports the ones that are stale.
function generate(args) {
  const check = args.includes('--check')
  const named = args.filter((a) => !a.startsWith('--'))
  const components = named.length ? named : discoverComponents()
  const project = createProject()

  const stale = []
  for (const component of components) {
    for (const { file, content } of buildPages(project, component)) {
      const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
      if (current === content) continue
      if (check) stale.push(path.relative(rootDir, file))
      else fs.writeFileSync(file, content)
    }
  }
  if (stale.length) {
    fail(
      `stale, run \`pnpm run generate:component-docs\`:\n  ${stale.join('\n  ')}`,
    )
  }
  // After the pages are written, so a page fixed by this run is not reported.
  assertStorybookSourceLinks()
  console.log(`${components.join(', ')}: ${check ? 'up to date' : 'generated'}`)
}

// Entry point: deliberate errors print as one line and exit 1, anything else
// keeps its stack trace.
function run(args) {
  try {
    generate(args)
  } catch (error) {
    if (!(error instanceof DocsError)) throw error
    console.error(`generate-component-docs: ${error.message}`)
    process.exit(1)
  }
}

module.exports = { run }
