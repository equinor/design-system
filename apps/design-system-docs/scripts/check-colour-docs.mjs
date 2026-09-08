#!/usr/bin/env node
/**
 * Verifies the colour foundation docs against the token source.
 *
 *   pnpm check:colour-docs
 *
 * Three things are checked, all against packages/eds-tokens:
 *
 *   1. every dotted token name in the prose exists
 *   2. every `--eds-*` custom property in the prose exists
 *   3. the structural facts the components hold as literals - how many tones there are, how many
 *      steps a tone has, how many data-visualisation ramps and of what length - match the source
 *
 * The third matters because those cannot be read from a `var()`. Without it, a seventh tone or an
 * extra data-visualisation category would leave the pages quietly rendering an incomplete picture.
 *
 * Docusaurus will not catch any of this: a mistyped custom property renders as an unstyled element
 * and a stale count renders as a smaller grid, both without error.
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const app = join(here, '..')
const tokens = join(app, '..', '..', 'packages', 'eds-tokens', 'src', 'tokens')
const colourDocs = join(app, 'docs', 'foundation', 'colour')
const components = join(app, 'src', 'components')

const PROSE = ['intro.mdx', 'getting_started.mdx', 'palette.mdx', 'migration.mdx']
const COMPONENTS = ['ColourPairing.tsx', 'ColourStates.tsx', 'ColourScale.tsx', 'DataVizPalette.tsx']

// --- canonical names ---------------------------------------------------------------------------

const dtcg = JSON.parse(readFileSync(join(tokens, 'dtcg', 'semantic', 'default.json'), 'utf8'))

function* walk(node, path = []) {
  if (node && typeof node === 'object') {
    if ('$value' in node) return yield [path.join('.'), node]
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) yield* walk(v, [...path, k])
  }
}

const canon = new Set()
const cssCanon = new Set()
for (const [name, token] of walk(dtcg)) {
  canon.add(name)
  const web = token.$extensions?.['com.figma']?.codeSyntax?.WEB
  if (web) cssCanon.add(web.replace(/^var\(|\)$/g, ''))
}

// Primitives are below the semantic layer and are painted directly by ColourScale.
const bundle = readFileSync(join(tokens, 'css', 'variables.css'), 'utf8')
const declared = new Set([...bundle.matchAll(/(--eds-[a-z0-9-]+)\s*:/g)].map((m) => m[1]))

// The migration page quotes 2.x names on purpose, as the "before" side. Read them from the legacy
// build rather than allowing a prefix, so a typo in a legacy name still fails.
const legacyBuild = join(tokens, '..', '..', 'build', 'css', 'variables.css')
if (existsSync(legacyBuild)) {
  for (const m of readFileSync(legacyBuild, 'utf8').matchAll(/(--eds-[a-z0-9-]+)\s*:/g)) {
    declared.add(m[1])
  }
}

const problems = []
const isPrefix = (name) => [...canon].some((c) => c.startsWith(name + '.'))

// --- 1 and 2: names in prose -------------------------------------------------------------------

for (const file of PROSE) {
  const path = join(colourDocs, file)
  if (!existsSync(path)) continue
  const src = readFileSync(path, 'utf8')
  const body = src.replace(/\[[^\]]*\]\([^)]*\)/g, '') // strip links so URLs are not scanned

  for (const m of body.matchAll(/`([a-z][a-z0-9-]*(?:\.[a-z0-9*<>-]+)+)`/g)) {
    const name = m[1]
    if (canon.has(name)) continue
    const probe = name.replaceAll('<tone>', 'accent').replace(/\.\*$/, '')
    if (canon.has(probe) || isPrefix(probe)) continue
    const dv = 'data-visualization.' + probe
    if (canon.has(dv) || isPrefix(dv)) continue
    problems.push({ file, line: body.slice(0, m.index).split('\n').length, name, kind: 'token' })
  }

  for (const m of src.matchAll(/--eds-[a-z0-9-]+/g)) {
    if (cssCanon.has(m[0]) || declared.has(m[0])) continue
    problems.push({ file, line: src.slice(0, m.index).split('\n').length, name: m[0], kind: 'css' })
  }
}

// --- names in components -----------------------------------------------------------------------

const TONES = ['accent', 'neutral', 'info', 'success', 'warning', 'danger']

for (const file of COMPONENTS) {
  const path = join(components, file)
  if (!existsSync(path)) continue
  const src = readFileSync(path, 'utf8')
  for (const m of src.matchAll(/'([a-z][a-z0-9-]*(?:\.[a-z0-9{}-]+)+)'/g)) {
    const candidates = m[1].includes('{tone}')
      ? TONES.map((t) => m[1].replaceAll('{tone}', t))
      : [m[1]]
    for (const c of candidates) {
      if (canon.has(c)) continue
      problems.push({
        file: `src/components/${file}`,
        line: src.slice(0, m.index).split('\n').length,
        name: c,
        kind: 'token',
      })
    }
  }
}

// --- 3: structural counts ------------------------------------------------------------------------

const distinct = (re) => new Set([...canon].map((n) => n.match(re)?.[1]).filter(Boolean)).size
const literal = (file, re) => {
  const path = join(components, file)
  return existsSync(path) ? Number(readFileSync(path, 'utf8').match(re)?.[1] ?? -1) : null
}
const quoted = (file, re) => {
  const path = join(components, file)
  if (!existsSync(path)) return null
  const body = readFileSync(path, 'utf8').match(re)?.[1]
  return body ? (body.match(/'/g)?.length ?? 0) / 2 : -1
}

const structure = [
  ['tones', distinct(/^background\.interactive\.([a-z]+)\./), 'ColourPairing.tsx', quoted('ColourPairing.tsx', /const TONES = \[([\s\S]*?)\]/)],
  ['interactive states', distinct(/^background\.interactive\.accent\.emphasis\.([a-z]+)$/), 'ColourStates.tsx', quoted('ColourStates.tsx', /const STATES = \[([\s\S]*?)\]/)],
  ['non-interactive levels', distinct(/^background\.non-interactive\.accent\.([a-z]+)$/), 'ColourStates.tsx', quoted('ColourStates.tsx', /const LEVELS = \[([\s\S]*?)\]/)],
  ['data-visualisation categories', distinct(/^data-visualization\.cat\.(\d+)\./), 'DataVizPalette.tsx', literal('DataVizPalette.tsx', /const CATEGORIES = Array\.from\(\{ length: (\d+)/)],
  ['category steps', distinct(/^data-visualization\.cat\.\d+\.(\d+)$/), 'DataVizPalette.tsx', literal('DataVizPalette.tsx', /const CAT_STEPS = Array\.from\(\{ length: (\d+)/)],
  ['sequential steps', distinct(/^data-visualization\.seq\.(\d+)$/), 'DataVizPalette.tsx', literal('DataVizPalette.tsx', /const SEQ = Array\.from\(\{ length: (\d+)/)],
  ['diverging steps', distinct(/^data-visualization\.div\.(\d+)$/), 'DataVizPalette.tsx', literal('DataVizPalette.tsx', /const DIV = Array\.from\(\{ length: (\d+)/)],
  ['scale steps', new Set([...bundle.matchAll(/--eds-accent-(\d+)\s*:/g)].map((m) => m[1])).size, 'ColourScale.tsx', literal('ColourScale.tsx', /const STEPS = Array\.from\(\{ length: (\d+)/)],
]

for (const [what, source, file, found] of structure) {
  if (found === null) continue
  if (found !== source) {
    problems.push({
      file: `src/components/${file}`,
      line: 0,
      name: `${what}: component says ${found}, token source has ${source}`,
      kind: 'structure',
    })
  }
}

// --- report --------------------------------------------------------------------------------------

if (problems.length) {
  console.error(`${problems.length} problem(s) in the colour docs:`)
  for (const p of problems) console.error(`  ${p.file}:${p.line}  [${p.kind}]  ${p.name}`)
  process.exit(1)
}

console.log(
  `ok - ${PROSE.length} pages and ${COMPONENTS.length} components: every token name and custom ` +
    `property resolves, and every structural count matches the token source ` +
    `(${canon.size} tokens, ${cssCanon.size} custom properties)`,
)
