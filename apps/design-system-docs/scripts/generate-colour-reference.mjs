#!/usr/bin/env node
/**
 * Generates the colour token reference table into
 * docs/foundation/colour/reference.mdx, between the GENERATED markers.
 *
 *   pnpm generate:colour-reference
 *
 * Everything comes from the Tokens Studio output committed in packages/eds-tokens:
 *
 *   dtcg/semantic/default.json   token names, and each token's own CSS custom property
 *                                (`$extensions["com.figma"].codeSyntax.WEB`)
 *   css/variables.css            the resolved value, per colour scheme
 *
 * No value is ever typed by hand, and the CSS names are not derived from the Figma names by a
 * transform: both come from one definition, so they cannot drift apart.
 *
 * Only the region between the markers is rewritten. Prose above and below is preserved.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const app = join(here, '..')
const tokens = join(app, '..', '..', 'packages', 'eds-tokens', 'src', 'tokens')
const target = join(app, 'docs', 'foundation', 'colour', 'reference.mdx')

for (const [what, path] of [
  ['token package', tokens],
  ['reference page', target],
]) {
  if (!existsSync(path)) {
    console.error(`Cannot find the ${what} at ${path}`)
    process.exit(1)
  }
}

const BEGIN =
  '{/* GENERATED:BEGIN - regenerate with pnpm generate:colour-reference. Do not edit by hand. */}'
const END = '{/* GENERATED:END */}'

// --- names and CSS custom properties, from the DTCG export -------------------------------------

const dtcg = JSON.parse(readFileSync(join(tokens, 'dtcg', 'semantic', 'default.json'), 'utf8'))

function* walk(node, path = []) {
  if (node && typeof node === 'object') {
    if ('$value' in node) {
      yield [path.join('.'), node]
      return
    }
    for (const [key, value] of Object.entries(node)) {
      if (!key.startsWith('$')) yield* walk(value, [...path, key])
    }
  }
}

const colours = new Map()
for (const [name, token] of walk(dtcg)) {
  if (token.$type !== 'color') continue
  const web = token.$extensions?.['com.figma']?.codeSyntax?.WEB
  colours.set(name, web ? web.replace(/^var\(|\)$/g, '') : null)
}

// --- resolved values, from the CSS bundle ------------------------------------------------------

const css = readFileSync(join(tokens, 'css', 'variables.css'), 'utf8')

function declarations(selector) {
  const block = css.match(
    new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}'),
  )
  return block ? Object.fromEntries([...block[1].matchAll(/(--eds-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])) : {}
}

/** Later selectors win, the same way the cascade resolves them in the browser. */
function scope(scheme) {
  return {
    ...Object.fromEntries([...css.matchAll(/(--eds-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])),
    ...declarations('[data-color-scheme]'),
    ...declarations(`[data-color-scheme="${scheme}"]`),
  }
}

const SCOPES = { light: scope('light'), dark: scope('dark') }

function resolve(scheme, cssName, depth = 0) {
  const value = SCOPES[scheme][cssName]
  if (value === undefined) return null
  const ref = value.match(/^var\((--eds-[a-z0-9-]+)\)$/)
  if (ref && depth < 12) return resolve(scheme, ref[1], depth + 1)
  return value
}

// --- grouping ----------------------------------------------------------------------------------

const GROUPS = [
  [
    'Surfaces and planes',
    (n) => n.startsWith('background.') && !/^background\.(interactive|non-interactive)\./.test(n),
    'The planes an interface is built from. `canvas` sits behind everything; `surface` is what content sits on.',
  ],
  [
    'Interactive backgrounds',
    (n) => n.startsWith('background.interactive.'),
    'Fills for anything the user can act on. Every one carries `default`, `hover` and `pressed`.',
  ],
  [
    'Non-interactive backgrounds',
    (n) => n.startsWith('background.non-interactive.'),
    'Fills for things that convey state but cannot be clicked: banners, badges, status chips. No hover values, deliberately.',
  ],
  [
    'Interactive borders',
    (n) => n.startsWith('border.interactive.'),
    'Strokes on actionable elements, plus the focus ring and the selected indicator.',
  ],
  [
    'Non-interactive borders',
    (n) => n.startsWith('border.non-interactive.'),
    'Dividers, outlines and containers. `muted` / `default` / `emphasis` is a scale of prominence, not a set of states.',
  ],
  ['Text', (n) => n.startsWith('text.'), 'Text and anything read as text.'],
  [
    'Icons',
    (n) => n.startsWith('icon.'),
    'Split from text because a thin icon stroke needs more contrast than a letterform of the same size to read as equally solid.',
  ],
  ['Overlay', (n) => n.startsWith('overlay.'), 'The dim behind a modal. The only alpha value in the colour set.'],
  [
    'Data visualisation',
    (n) => n.startsWith('data-visualization.'),
    'Chart colour, tuned for telling series apart rather than for contrast against a surface. No EDS component binds these.',
  ],
]

const all = [...colours.keys()].sort()
const unresolved = []

const row = (name) => {
  const cssName = colours.get(name)
  const light = cssName ? resolve('light', cssName) : null
  const dark = cssName ? resolve('dark', cssName) : null
  if (!light || !dark) unresolved.push(name)
  // The swatch is a live var(), so it follows the colour scheme and never goes stale. It sits in
  // the Token cell rather than a column of its own: a fifth column squeezed the CSS property into a
  // vertical stack, and the swatch belongs next to the name anyway.
  const swatch = cssName ? `<Swatch t="${cssName.replace(/^--eds-/, '')}" /> ` : ''
  return `| ${swatch}\`${name}\` | ${cssName ? '`' + cssName + '`' : 'none'} | \`${light ?? '?'}\` | \`${dark ?? '?'}\` |`
}

const out = [
  `**${all.length} colour tokens.** Values are resolved from the canonical token source; colour does`,
  'not vary with density, only with colour scheme.',
  '',
  'The **Token** column is the name you pick in Figma. The **CSS custom property** column is the same',
  "token's name in code. Both come from the token definition itself, so they cannot drift apart.",
]

const seen = new Set()
for (const [label, matches, blurb] of GROUPS) {
  const names = all.filter((n) => matches(n) && !seen.has(n))
  names.forEach((n) => seen.add(n))
  if (!names.length) continue
  out.push('', `## ${label}`, '', blurb, '', `${names.length} tokens.`, '')
  out.push('<div className="colour-reference">', '')
  out.push('| Token | CSS custom property | Light | Dark |', '| --- | --- | --- | --- |')
  names.forEach((n) => out.push(row(n)))
  out.push('', '</div>')
}

const ungrouped = all.filter((n) => !seen.has(n))
if (ungrouped.length) {
  out.push('', '## Other', '', '| Token | CSS custom property | Light | Dark |', '| --- | --- | --- | --- |')
  ungrouped.forEach((n) => out.push(row(n)))
}

if (unresolved.length) {
  console.error(`${unresolved.length} token(s) could not be resolved from the CSS bundle:`)
  unresolved.forEach((n) => console.error(`  ${n}`))
  console.error('Refusing to write a page with unresolved values.')
  process.exit(1)
}

// --- write, between the markers ----------------------------------------------------------------

const generated = [BEGIN, '', out.join('\n'), '', END].join('\n')
const current = readFileSync(target, 'utf8')

// Match by shape, not by exact wording: the marker text has changed before, and an exact-string
// match that misses silently appends a second copy of the whole table.
const begin = current.match(/\{\/\* GENERATED:BEGIN[\s\S]*?\*\/\}/)
const end = current.match(/\{\/\* GENERATED:END \*\/\}/)

if (!begin !== !end) {
  console.error(
    `${target} has a ${begin ? 'BEGIN' : 'END'} marker but no ${begin ? 'END' : 'BEGIN'} marker. ` +
      'Refusing to write; fix the markers by hand first.',
  )
  process.exit(1)
}
if (begin && end && end.index < begin.index) {
  console.error(`${target}: GENERATED:END precedes GENERATED:BEGIN.`)
  process.exit(1)
}

const next =
  begin && end
    ? current.slice(0, begin.index) + generated + current.slice(end.index + end[0].length)
    : current.trimEnd() + '\n\n' + generated + '\n'

writeFileSync(target, next)
console.log(`wrote ${target}`)
console.log(`  ${all.length} tokens across ${GROUPS.filter(([, m]) => all.some(m)).length} groups`)
