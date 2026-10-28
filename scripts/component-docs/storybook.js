const fs = require('fs')
const path = require('path')
const { Node, Project } = require('ts-morph')
const { rootDir } = require('./config')
const { fail } = require('./errors')
const { unwrap } = require('./stories')

// The folders the eds-core-react Storybook indexes, from the `stories` globs in
// packages/eds-core-react/.storybook/main.mjs.
const STORYBOOK_ROOTS = [
  'packages/eds-core-react/src',
  'packages/eds-core-react/stories',
]

// The id Storybook derives from a title, the same as its sanitize() for ASCII
// titles: 'Beta/Inputs/Selection Controls/Checkbox' gives
// 'beta-inputs-selection-controls-checkbox'.
const toStorybookId = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function storyFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name === 'node_modules' ? [] : storyFiles(file)
    }
    return /\.(mdx|stories\.tsx?)$/.test(entry.name) ? [file] : []
  })
}

// The title of a CSF file: `title` on the default export, which is `meta` in
// every stories file today.
function csfTitle(sf) {
  let meta = sf.getExportAssignment((e) => !e.isExportEquals())?.getExpression()
  if (Node.isIdentifier(meta)) {
    meta = sf.getVariableDeclaration(meta.getText())?.getInitializer()
  }
  meta = unwrap(meta)
  if (!Node.isObjectLiteralExpression(meta)) return undefined
  const title = meta.getProperty('title')
  const value = Node.isPropertyAssignment(title)
    ? title.getInitializer()
    : undefined
  return Node.isStringLiteral(value) ||
    Node.isNoSubstitutionTemplateLiteral(value)
    ? value.getLiteralValue()
    : undefined
}

// Every title id in the Storybook: CSF meta titles and the titles of
// unattached MDX pages. Attached MDX (`<Meta of={...} />`) shares the id of
// its stories file.
let cachedIds
function storybookIds() {
  if (cachedIds) return cachedIds
  const project = new Project({ skipAddingFilesFromTsConfig: true })
  const titles = STORYBOOK_ROOTS.flatMap((root) =>
    storyFiles(path.join(rootDir, root)),
  ).map((file) =>
    file.endsWith('.mdx')
      ? fs
          .readFileSync(file, 'utf8')
          .match(/<Meta\b[^>]*\btitle="([^"]+)"/)?.[1]
      : csfTitle(project.addSourceFileAtPath(file)),
  )
  cachedIds = new Set(titles.filter(Boolean).map(toStorybookId))
  return cachedIds
}

// Storybook links on a page (`?path=/docs/...` and `?path=/story/...`) must
// point at a title that exists, so a renamed section or a typo stops the build
// instead of publishing a dead link. Only the title part before `--` is
// checked, not the story name after it.
function assertStorybookLinks({ file, content }, ids = storybookIds()) {
  const broken = content
    .split('\n')
    .flatMap((line, i) =>
      [...line.matchAll(/\?path=\/(?:docs|story)\/([a-z0-9-]+?)--/g)]
        .filter(([, id]) => !ids.has(id))
        .map(([, id]) => `${path.relative(rootDir, file)}:${i + 1} \`${id}\``),
    )
  if (broken.length) {
    fail(
      `no Storybook title gives these ids, so the links would be dead. Fix them in the source (the .docs.md sidecar, a story caption or BETA_CALLOUT in config.js):\n  ${broken.join('\n  ')}`,
    )
  }
}

module.exports = { toStorybookId, storybookIds, assertStorybookLinks }
