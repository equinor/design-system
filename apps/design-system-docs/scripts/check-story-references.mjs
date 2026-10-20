/**
 * Static gate for the two ways a doc can point at a Storybook story.
 *
 *   node scripts/check-story-references.mjs
 *
 * Both reference styles fail *silently* at runtime, which is why this exists:
 *
 * - `<StoryCanvas of="Button/Default" />` — an unknown `of` logs to the console
 *   and renders nothing (src/components/StoryCanvas/StoryCanvas.tsx). The
 *   registry in stories.ts is type-safe, but `of` is a plain string, so a typo
 *   or a renamed story is invisible until someone looks at the page.
 * - `<StorybookEmbed id="…" />` — a wrong id renders Storybook's own error
 *   frame inside the iframe, which the Docusaurus build never sees.
 *
 * Story ids are derived with Storybook's own `toId`/`storyNameFromExport`
 * (`storybook/internal/csf`) rather than a local reimplementation, so this
 * cannot drift from how Storybook actually slugifies a title.
 *
 * Exits non-zero listing every unresolved reference.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// `storybook` is a dependency of this app; the shared import resolver is scoped
// to packages/* and never looks in apps/*/node_modules, so it reports a false
// positive here.
// eslint-disable-next-line import/no-unresolved
import { storyNameFromExport, toId } from 'storybook/internal/csf'

const appDir = resolve(fileURLToPath(import.meta.url), '../..')
const repoRoot = resolve(appDir, '../..')
const coreReactSrc = join(repoRoot, 'packages/eds-core-react/src')

/** Recursively collect files under `dir` whose name matches `test`. */
function walk(dir, test, found = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path, test, found)
    else if (test(entry)) found.push(path)
  }
  return found
}

/** Every exported story name in a file: `export const Foo` + `export { A as B }`. */
function readStoryExports(source) {
  const names = [...source.matchAll(/^export const (\w+)/gm)].map((m) => m[1])
  for (const [, clause] of source.matchAll(/^export \{([^}]*)\}/gm)) {
    for (const spec of clause.split(',')) {
      const name = spec
        .trim()
        .split(/\s+as\s+/)
        .pop()
      if (name && /^\w+$/.test(name) && name !== 'default') names.push(name)
    }
  }
  return new Set(names)
}

/**
 * The CSF `title`, read from the `const meta` block only.
 *
 * An unanchored `/title:/` search would just as happily match an
 * `args: { title: '…' }` or a `parameters` block declared above `meta` and
 * return a wrong-but-plausible title. Every id derived from it would then be
 * wrong rather than absent — a false *pass*, which is the one failure mode a
 * silent-drift gate must not have.
 */
function readStoryTitle(source) {
  const metaStart = source.search(/^(?:export )?const meta\b/m)
  if (metaStart === -1) return undefined
  return source.slice(metaStart).match(/^ {2}title:\s*'([^']+)'/m)?.[1]
}

/** Exported story names + the CSF `title` from a story file. */
function readStoryFile(path) {
  const source = readFileSync(path, 'utf8')
  return {
    exports: readStoryExports(source),
    title: readStoryTitle(source),
  }
}

const storyFiles = new Map(
  walk(coreReactSrc, (name) => name.endsWith('.stories.tsx')).map((path) => [
    path,
    readStoryFile(path),
  ]),
)

// ── StoryCanvas: registry (stories.ts) → story file, per component ──────────
const registrySource = readFileSync(
  join(appDir, 'src/components/StoryCanvas/stories.ts'),
  'utf8',
)
const importPaths = new Map(
  [
    ...registrySource.matchAll(
      /import \* as (\w+)Stories from '@eds-core-react-src\/([^']+)'/g,
    ),
  ].map(([, name, relative]) => [name, join(coreReactSrc, `${relative}.tsx`)]),
)
const registered = new Set(
  [...registrySource.matchAll(/^\s+(\w+): composeStories\(/gm)].map(
    (m) => m[1],
  ),
)

// ── Every story id Storybook would generate, for StorybookEmbed ─────────────
const knownIds = new Set()
for (const { exports, title } of storyFiles.values()) {
  if (!title) continue
  for (const name of exports)
    knownIds.add(toId(title, storyNameFromExport(name)))
}

// ── Scan the docs for both reference styles ────────────────────────────────
const failures = []

for (const docPath of walk(
  join(appDir, 'docs'),
  (name) => name.endsWith('.md') || name.endsWith('.mdx'),
)) {
  const source = readFileSync(docPath, 'utf8')
  const where = docPath.replace(`${repoRoot}/`, '')

  for (const [, of] of source.matchAll(/<StoryCanvas\b[^>]*?\bof="([^"]+)"/g)) {
    const [component, story] = of.split('/')
    if (!registered.has(component)) {
      failures.push(
        `${where}: <StoryCanvas of="${of}"> — "${component}" is not in the StoryCanvas registry`,
      )
      continue
    }
    const file = storyFiles.get(importPaths.get(component))
    if (!file) {
      failures.push(
        `${where}: <StoryCanvas of="${of}"> — registry import for "${component}" does not resolve to a story file`,
      )
    } else if (!file.exports.has(story)) {
      failures.push(
        `${where}: <StoryCanvas of="${of}"> — no "export const ${story}" in ${component}.stories.tsx`,
      )
    }
  }

  for (const [, id] of source.matchAll(
    /<StorybookEmbed\b[^>]*?\bid="([^"]+)"/g,
  ))
    if (!knownIds.has(id))
      failures.push(
        `${where}: <StorybookEmbed id="${id}"> — no story with that id exists`,
      )
}

if (failures.length) {
  console.error(`✖ ${failures.length} unresolved story reference(s):\n`)
  for (const failure of failures) console.error(`  ${failure}`)
  console.error(
    "\nCheck the component's .stories.tsx exports, and src/components/StoryCanvas/stories.ts for the registry.",
  )
  process.exit(1)
}

console.log(
  `✓ every StoryCanvas and StorybookEmbed reference resolves (${storyFiles.size} story files, ${registered.size} registered components)`,
)
