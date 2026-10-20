const fs = require('fs')
const path = require('path')
const {
  rootDir,
  PLATFORMS,
  DOCS_SITE,
  DOCS_SITE_DIR,
  GITHUB_BLOB,
} = require('./config')
const { fail } = require('./errors')

// A component is documented when its web folder has a sidecar. The mobile side
// is optional: only components that exist in React Native have one.
function discoverComponents() {
  const nextDir = path.join(rootDir, PLATFORMS.web.componentsRoot)
  return fs
    .readdirSync(nextDir)
    .filter((c) => fs.existsSync(path.join(nextDir, c, `${c}.docs.md`)))
    .sort()
}

// Finds the folder that holds {Component}.tsx, in the components root or one
// level below it (mobile Checkbox, Radio and Switch share SelectionControls/).
function locate(cfg, component) {
  const root = path.join(rootDir, cfg.componentsRoot)
  const folders = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'node_modules')
    .map((d) => path.join(root, d.name))
  for (const dir of [root, ...folders]) {
    const file = path.join(dir, `${component}.tsx`)
    if (fs.existsSync(file)) return { dir, file }
  }
  return null
}

const githubUrl = (file) => `${GITHUB_BLOB}/${path.relative(rootDir, file)}`

// {Component}Props may be a type alias or an interface, in any non-test file of
// the component's folder (a shared types.ts, or the component file itself).
function findPropsDeclaration(project, dir, component) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\.tsx?$/.test(f))
  for (const f of files) {
    const sf = project.addSourceFileAtPath(path.join(dir, f))
    const decl =
      sf.getTypeAlias(`${component}Props`) ??
      sf.getInterface(`${component}Props`)
    if (decl) return decl
  }
  return fail(
    `no ${component}Props type or interface in ${path.relative(rootDir, dir)}`,
  )
}

// One Figma component serves both platforms, so the web Code Connect file is
// the source for both pages.
function readFigmaUrl(webDir, component) {
  const file = path.join(webDir, `${component}.figma.tsx`)
  if (!fs.existsSync(file)) return undefined
  return fs
    .readFileSync(file, 'utf8')
    .match(/https:\/\/www\.figma\.com\/[^'"\s]+/)?.[0]
}

// The docs-site page for a component. Pages are named after the lowercased
// component (inputs/textfield.md), except where one page covers several
// components (inputs/selection_controls.md), which the sidecar names with
// `- Docs: inputs/selection_controls`.
function docsPageUrl(component, override) {
  const root = path.join(rootDir, DOCS_SITE_DIR)
  if (override) {
    if (!fs.existsSync(path.join(root, `${override}.md`))) {
      fail(`${component}: Docs page ${override} not found in ${DOCS_SITE_DIR}`)
    }
    return `${DOCS_SITE}/${override}`
  }
  const file = `${component.toLowerCase()}.md`
  const category = fs
    .readdirSync(root, { withFileTypes: true })
    .find(
      (d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, file)),
    )
  return category
    ? `${DOCS_SITE}/${category.name}/${file.replace(/\.md$/, '')}`
    : undefined
}

module.exports = {
  discoverComponents,
  locate,
  githubUrl,
  findPropsDeclaration,
  readFigmaUrl,
  docsPageUrl,
}
