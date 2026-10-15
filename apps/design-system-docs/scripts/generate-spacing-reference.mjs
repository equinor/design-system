#!/usr/bin/env node
/**
 * Generates every value table on the spacing pages, from the token source.
 *
 *   pnpm generate:spacing-reference
 *
 * Everything comes from the Tokens Studio output committed in packages/eds-tokens:
 *
 *   dtcg/semantic/default.json   token names, and each token's own CSS custom property
 *                                (`$extensions["com.figma"].codeSyntax.WEB`)
 *   css/variables.css            the resolved value, per density
 *
 * No spacing value is ever typed into a page by hand. Density makes this worse than it is for
 * colour: one step has three values, so a hand-written table is three chances to be wrong and
 * nothing in the build would notice.
 *
 * Prose columns are the exception, and they live in ROLES and GROUPS below rather than in the page,
 * so the generator can refuse to write a table with a step it has no wording or group for. That is
 * the failure a generated table would otherwise hide: a new step appears with an empty cell beside
 * it, or in no group at all.
 *
 * Only the regions between markers are rewritten. Prose outside them is preserved.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const app = join(here, '..')
const tokens = join(app, '..', '..', 'packages', 'eds-tokens', 'src', 'tokens')
const docs = join(app, 'docs', 'foundation', 'design-tokens')

if (!existsSync(tokens)) {
  console.error(`Cannot find the token package at ${tokens}`)
  process.exit(1)
}

// --- names and CSS custom properties, from the DTCG export -------------------------------------

const dtcg = JSON.parse(
  readFileSync(join(tokens, 'dtcg', 'semantic', 'default.json'), 'utf8'),
)

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

/** Dotted name -> its own CSS custom property, for the two groups these pages cover. */
const named = new Map()
for (const [name, token] of walk(dtcg)) {
  if (!/^(spacing|corner-radius)\./.test(name)) continue
  const web = token.$extensions?.['com.figma']?.codeSyntax?.WEB
  named.set(name, web ? web.replace(/^var\(|\)$/g, '') : null)
}

// --- resolved values, from the CSS bundle ------------------------------------------------------

const css = readFileSync(join(tokens, 'css', 'variables.css'), 'utf8')

/**
 * Every block whose selector list names `selector`, merged in source order. The list is split
 * rather than matched as text, because the bundle widens some layers to several selectors: the
 * semantic layer, where every spacing name is declared, is `:root, [data-color-scheme]`, and after
 * #5247 also `[data-density]`.
 */
function declarationsOf(selector) {
  const merged = {}
  const blocks = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .matchAll(/([^{}]+)\{([^}]*)\}/g)
  for (const [, selectors, body] of blocks) {
    if (!selectors.split(',').some((part) => part.trim() === selector)) continue
    for (const m of body.matchAll(/(--eds-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      merged[m[1]] = m[2].trim()
    }
  }
  return merged
}

// What an element sees at each density: everything declared at `:root`, with the density block
// on top. Comfortable is the density at `:root`, so it is the base rather than a case.
const base = declarationsOf(':root')
const DENSITIES = ['compact', 'comfortable', 'relaxed']
const SCOPES = Object.fromEntries(
  DENSITIES.map((density) => [
    density,
    density === 'comfortable'
      ? base
      : { ...base, ...declarationsOf(`[data-density="${density}"]`) },
  ]),
)

/**
 * Substitutes `var()` references until a length is left. `rounded-outer` is a `calc()` of two
 * references rather than a plain alias, so this substitutes inside the expression and then folds
 * the addition, instead of only following single-reference chains.
 */
function resolve(density, cssName) {
  const scope = SCOPES[density]
  let value = scope[cssName]
  if (value === undefined) return null
  for (let pass = 0; pass < 12 && /var\(/.test(value); pass++) {
    value = value.replace(
      /var\((--eds-[a-z0-9-]+)\)/g,
      (whole, ref) => scope[ref] ?? whole,
    )
  }
  if (/var\(/.test(value)) return null
  const sum = value.match(/^calc\(\s*(-?[\d.]+)px\s*\+\s*(-?[\d.]+)px\s*\)$/)
  return sum ? `${Number(sum[1]) + Number(sum[2])}px` : value
}

const px = (value) => (value ? Number.parseFloat(value) : null)

// --- the named steps ---------------------------------------------------------------------------

/** Declaration order is the scale's order, and it is not alphabetical. */
const STEPS = [
  'none',
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
]

const RADII = ['none', 'rounded', 'rounded-outer', 'pill']

/**
 * The one hand-written column on these pages: what a step is for is a design decision with no
 * machine-readable source. The wording cannot be checked, but a step gaining or losing a row can,
 * and that is the failure that would leave a blank cell beside a value.
 */
const ROLES = {
  none: 'removing space on purpose. Better than `0`, because it survives a density change',
  '4xs': 'hairline separation, and nudging an icon off its text',
  '3xs': 'padding inside dense controls: chips, badges, tags',
  '2xs': 'tight control padding',
  xs: "the default gap between a control's own parts, such as an icon and its label",
  sm: 'the default gap between related items in a group',
  md: '**the default container padding. Start here**',
  lg: 'separating groups inside a container',
  xl: 'separating sections inside a container, such as a card or dialog',
  '2xl': 'page-level rhythm, in layouts rather than components',
  '3xl': 'page-level rhythm, wider than a component has a use for',
  '4xl': 'layout: the gap between blocks inside one region of a page',
  '5xl': 'layout: the gap between major regions of a page',
  '6xl': 'layout: card gutters, and the space between grouped blocks',
  '7xl': 'layout: the gap between one section of a page and the next',
  '8xl': 'layout: separating whole sections of a long page',
  '9xl': 'layout: the widest step, for full-page composition',
}

/**
 * The groups the pages present the steps in, named by what the space sits inside or separates.
 * Like ROLES, the grouping is a design decision with no machine-readable source. What can be
 * checked is that every step is in exactly one group, in scale order, so a new step cannot be left
 * out of the grouped tables while still showing up in the flat ones.
 *
 * `description` goes under the group's heading, and `uses` goes in the summary table.
 */
const GROUPS = [
  {
    name: 'Zero',
    steps: ['none'],
    description: 'One step, for an element that should have no space at all.',
    uses: 'removing space on purpose',
  },
  {
    name: 'Inside a control',
    steps: ['4xs', '3xs', '2xs', 'xs'],
    description:
      'The space inside one control, such as a button or a checkbox: the gaps between its own ' +
      'parts, and the padding of dense controls like chips and tags.',
    uses: "the gaps between a control's own parts, and padding in dense controls",
  },
  {
    name: 'Inside a container',
    steps: ['sm', 'md', 'lg', 'xl'],
    description:
      "The space inside a card, dialog, list or form: the container's padding, and the gaps " +
      'between the items, groups and sections it holds.',
    uses: 'container padding, and the gaps between items, groups and sections in a container',
  },
  {
    name: 'Page frame',
    steps: ['2xl', '3xl'],
    description:
      'The outer frame of a page: its gutters, and the rhythm of the layout that the ' +
      'components sit in.',
    uses: 'page gutters and page-level rhythm',
  },
  {
    name: 'Page regions',
    steps: ['4xl', '5xl', '6xl'],
    description:
      'The space between the parts of a page: blocks inside one region, whole regions such as a ' +
      'sidebar and its content, and the gutters in a grid of cards.',
    uses: 'the gaps between blocks and regions of a page, and card gutters',
  },
  {
    name: 'Page sections',
    steps: ['7xl', '8xl', '9xl'],
    description:
      'The widest steps, for the space between one section of a page and the next, and around a ' +
      'whole page of content.',
    uses: 'the gaps between sections of a page, and the space around a whole page',
  },
]

/** The anchor Docusaurus gives a heading, for the plain-word headings GROUPS uses. */
const slug = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const RADIUS_ROLES = {
  none: 'full-bleed edges and table cells',
  rounded: 'the default: buttons, inputs, chips',
  'rounded-outer':
    'nothing, in code. It exists so Figma can draw the focus ring, which CSS derives from `outline-offset`',
  pill: 'fully round ends: pills, avatars, toggles',
}

const problems = []

for (const step of STEPS) {
  if (!named.has(`spacing.${step}`))
    problems.push(`spacing.${step} is not in the token source`)
  if (!ROLES[step]) problems.push(`spacing.${step} has no wording in ROLES`)
}

const grouped = GROUPS.flatMap((group) => group.steps)
if (grouped.join() !== STEPS.join()) {
  problems.push(
    `GROUPS has to list every step once, in scale order. It lists ${grouped.join(', ')}`,
  )
}

for (const name of named.keys()) {
  const step = name.replace(/^spacing\.|^corner-radius\./, '')
  const known = name.startsWith('spacing.')
    ? STEPS.includes(step)
    : RADII.includes(step)
  if (!known)
    problems.push(`${name} exists in the token source but no page lists it`)
}
for (const radius of RADII) {
  if (!named.has(`corner-radius.${radius}`))
    problems.push(`corner-radius.${radius} is not in the token source`)
  if (!RADIUS_ROLES[radius])
    problems.push(`corner-radius.${radius} has no wording in RADIUS_ROLES`)
}

const value = (name, density) => {
  const cssName = named.get(name)
  const resolved = cssName ? resolve(density, cssName) : null
  if (!resolved) problems.push(`${name} does not resolve at ${density}`)
  return resolved
}

// --- the primitive scale -----------------------------------------------------------------------

const primitives = [
  ...css.matchAll(/--eds-primitives-spacing-(\d+)\s*:\s*([\d.]+)px\s*;/g),
]
  .map((m) => ({ index: Number(m[1]), px: Number(m[2]) }))
  .sort((a, b) => a.index - b.index)

// The page states this rule, so it is checked rather than trusted. It holds in one direction only:
// px is the index rounded, and rounding is lossy, so four steps cannot be recovered from their px.
for (const { index, px: value } of primitives) {
  if (Math.round(index * 0.16) !== value) {
    problems.push(
      `primitive ${index} is ${value}px, but the documented rule gives ${Math.round(index * 0.16)}px`,
    )
  }
}

// --- the TypeScript names -----------------------------------------------------------------------

// The reference page tells the reader what a step is called in TypeScript. Spacing breaks the rule
// the colour pages state: a segment starting with a digit becomes a word, so `2xl` is `twoXl` and
// not `2xl`. That is a claim about generated output, so it is read back rather than restated.
const tsSemantic = join(tokens, 'ts', 'semantic', 'light.ts')
const tsDensity = join(tokens, 'ts', 'density', 'compact.ts')

const DIGIT_WORD = {
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
}

/** The identifier a dotted segment compiles to, as the generator writes it. */
const tsSegment = (segment) =>
  segment
    .replace(/^(\d)(.*)$/, (whole, digit, rest) =>
      DIGIT_WORD[digit]
        ? DIGIT_WORD[digit] + rest.slice(0, 1).toUpperCase() + rest.slice(1)
        : whole,
    )
    .split('-')
    .map((word, index) =>
      index === 0 ? word : word.slice(0, 1).toUpperCase() + word.slice(1),
    )
    .join('')

const tsNames = new Map(
  [...named.keys()].map((name) => [
    name,
    name.split('.').map(tsSegment).join('.'),
  ]),
)

for (const [file, prefix] of [
  [tsSemantic, 'semantic'],
  [tsDensity, 'density'],
]) {
  if (!existsSync(file)) {
    problems.push(`${prefix} TypeScript export is missing at ${file}`)
    continue
  }
  const src = readFileSync(file, 'utf8')
  for (const path of tsNames.values()) {
    // Leaf assignment, e.g. `roundedOuter: 5,`. The group key is checked by the same pass.
    const [group, leaf] = path.split('.')
    const block = src.match(
      new RegExp(`\\n  ${group}: \\{([\\s\\S]*?)\\n  \\}`),
    )
    if (!block) {
      problems.push(`${prefix} TypeScript export has no \`${group}\` group`)
      break
    }
    if (!new RegExp(`\\n    ${leaf}: -?[\\d.]+,`).test(block[1])) {
      problems.push(
        `${prefix} TypeScript export has no \`${group}.${leaf}\`, which the page documents`,
      )
    }
  }
}

// --- tables ------------------------------------------------------------------------------------

const tables = {}

tables['spacing-steps'] = GROUPS.flatMap((group, index) => [
  ...(index ? [''] : []),
  `### ${group.name}`,
  '',
  group.description,
  '',
  '| Step | Comfortable | Use it when |',
  '| --- | --- | --- |',
  ...group.steps.map(
    (step) =>
      `| \`spacing.${step}\` | ${value(`spacing.${step}`, 'comfortable')} | ${ROLES[step]} |`,
  ),
])

tables['spacing-groups'] = [
  '| Group | Steps | Use it for |',
  '| --- | --- | --- |',
  ...GROUPS.map(
    (group) =>
      `| [${group.name}](#${slug(group.name)}) | ${group.steps.map((step) => `\`${step}\``).join(', ')} | ${group.uses} |`,
  ),
]

tables['radius-steps'] = [
  '| Token | Comfortable | Use for |',
  '| --- | --- | --- |',
  ...RADII.map(
    (radius) =>
      `| \`corner-radius.${radius}\` | ${value(`corner-radius.${radius}`, 'comfortable')} | ${RADIUS_ROLES[radius]} |`,
  ),
]

tables['density-spacing'] = [
  '| Step | Compact | Comfortable | Relaxed |',
  '| --- | --- | --- | --- |',
  ...STEPS.map((step) => {
    const name = `spacing.${step}`
    const cells = DENSITIES.map((density) => value(name, density))
    return `| \`${name}\` | ${cells.join(' | ')} |`
  }),
]

tables['density-radius'] = [
  '| Token | Compact | Comfortable | Relaxed |',
  '| --- | --- | --- | --- |',
  ...RADII.map(
    (radius) =>
      `| \`corner-radius.${radius}\` | ${DENSITIES.map((density) => value(`corner-radius.${radius}`, density)).join(' | ')} |`,
  ),
]

tables['primitive-scale'] = [
  '<div className="spacing-primitive-scale">',
  '',
  '| Index | px |',
  '| --- | --- |',
  ...primitives.map((step) => {
    if (step.index === 100) {
      return '| **`100`** | <span className="spacing-primitive-scale__base">**16px (base)**</span> |'
    }
    return `| \`${step.index}\` | ${step.px}px |`
  }),
  '',
  '</div>',
]

tables['token-reference'] = [
  `**${STEPS.length + RADII.length} tokens.** Each one has three values, one per density. The **Token**`,
  'column is the name you pick in Figma and the **CSS custom property** column is the same token in',
  'code. Both come from the token definition itself, so they cannot drift apart. The **Comfortable**',
  'column is what you get with no `data-density` attribute set.',
  '',
  '## Spacing',
  '',
  `${STEPS.length} steps, applied to \`padding\`, \`gap\` and \`margin\`, in the same groups as`,
  '[the overview](./spacing.mdx#the-spacing-steps).',
  '',
  ...GROUPS.flatMap((group) => [
    `### ${group.name}`,
    '',
    group.description,
    '',
    '| Token | CSS custom property | Compact | Comfortable | Relaxed |',
    '| --- | --- | --- | --- | --- |',
    ...group.steps.map((step) => {
      const name = `spacing.${step}`
      return `| \`${name}\` | \`${named.get(name)}\` | ${DENSITIES.map((d) => value(name, d)).join(' | ')} |`
    }),
    '',
  ]),
  '## Corner radius',
  '',
  `${RADII.length} tokens, in the same density collection as spacing.`,
  '',
  '| Token | CSS custom property | Compact | Comfortable | Relaxed |',
  '| --- | --- | --- | --- | --- |',
  ...RADII.map((radius) => {
    const name = `corner-radius.${radius}`
    return `| \`${name}\` | \`${named.get(name)}\` | ${DENSITIES.map((d) => value(name, d)).join(' | ')} |`
  }),
  '',
  '## In TypeScript',
  '',
  'The tokens also ship as TypeScript objects, for the places a CSS custom property cannot reach.',
  'Spacing has one wrinkle the colour tokens do not: a name segment starting with a digit becomes a',
  `word, so \`spacing.2xl\` is \`${tsNames.get('spacing.2xl')}\` and \`corner-radius.rounded-outer\` is`,
  `\`${tsNames.get('corner-radius.rounded-outer')}\`.`,
  '',
  '```ts',
  "import { semantic } from '@equinor/eds-tokens/next/ts/semantic/light.ts'",
  '',
  `semantic.${tsNames.get('spacing.md')} // ${px(value('spacing.md', 'comfortable'))}`,
  `semantic.${tsNames.get('spacing.2xl')} // ${px(value('spacing.2xl', 'comfortable'))}`,
  `semantic.${tsNames.get('corner-radius.rounded-outer')} // ${px(value('corner-radius.rounded-outer', 'comfortable'))}`,
  '```',
  '',
  'Three differences from the CSS form, all easy to miss:',
  '',
  '- **The specifier carries the file extension.** `./next/*` is a wildcard onto the source tree, so',
  '  `next/ts/semantic/light` does not resolve and `next/ts/semantic/light.ts` does. The `next/`',
  '  paths are temporary for the beta line.',
  '- **The values are unitless numbers, not lengths.** `16`, not `16px`. Add the unit yourself.',
  '- **`semantic` is frozen at Comfortable.** There is no attribute for an object to read, so the',
  '  densities are separate modules and you pick one:',
  '',
  '```ts',
  "import { density } from '@equinor/eds-tokens/next/ts/density/compact.ts'",
  '',
  `density.${tsNames.get('spacing.md')} // ${px(value('spacing.md', 'compact'))}`,
  '```',
  '',
  'So prefer the CSS custom properties wherever they work. Use the TypeScript objects only',
  'where they do not, and expect to handle density yourself when you do.',
]

if (problems.length) {
  console.error(`${problems.length} problem(s), refusing to write:`)
  problems.forEach((p) => console.error(`  ${p}`))
  process.exit(1)
}

// --- write, between the markers ----------------------------------------------------------------

/**
 * Pads every markdown table to aligned columns, the way Prettier writes them. Prettier skips
 * `*.mdx` (see .prettierignore), so without this every run left the tables unaligned and the
 * pages with a whitespace-only diff.
 */
function alignTables(lines) {
  const out = []
  let inFence = false
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) inFence = !inFence
    if (inFence || !lines[i].startsWith('|')) {
      out.push(lines[i])
      continue
    }
    let end = i
    while (end < lines.length && lines[end].startsWith('|')) end++
    const rows = lines.slice(i, end).map((line) =>
      line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim()),
    )
    // Row 1 is the `| --- |` separator, which takes the width rather than setting it
    const widths = rows[0].map((_, col) =>
      Math.max(
        3,
        ...rows.filter((_, r) => r !== 1).map((row) => row[col].length),
      ),
    )
    for (const [r, row] of rows.entries()) {
      const cells = row.map((cell, col) =>
        r === 1 ? '-'.repeat(widths[col]) : cell.padEnd(widths[col]),
      )
      out.push(`| ${cells.join(' | ')} |`)
    }
    i = end - 1
  }
  return out
}

const TARGETS = {
  'spacing.mdx': ['spacing-steps', 'spacing-groups', 'radius-steps'],
  'spacing-scale.mdx': ['primitive-scale', 'density-spacing', 'density-radius'],
  'spacing-reference.mdx': ['token-reference'],
}

let written = 0
for (const [file, blocks] of Object.entries(TARGETS)) {
  const path = join(docs, file)
  if (!existsSync(path)) {
    console.error(`Cannot find ${path}`)
    process.exit(1)
  }
  let source = readFileSync(path, 'utf8')

  for (const block of blocks) {
    // Matched by shape rather than by exact wording: the marker text has changed before, and an
    // exact-string match that misses silently appends a second copy of the table.
    const begin = source.match(
      new RegExp(`\\{/\\* GEN:${block} BEGIN[\\s\\S]*?\\*/\\}`),
    )
    const end = source.match(new RegExp(`\\{/\\* GEN:${block} END \\*/\\}`))
    if (!begin || !end) {
      console.error(
        `${file} is missing the ${begin ? 'END' : 'BEGIN'} marker for ${block}`,
      )
      process.exit(1)
    }
    if (end.index < begin.index) {
      console.error(`${file}: GEN:${block} END precedes BEGIN`)
      process.exit(1)
    }
    const generated = [
      `{/* GEN:${block} BEGIN - regenerate with pnpm generate:spacing-reference. Do not edit by hand. */}`,
      '',
      alignTables(tables[block]).join('\n'),
      '',
      `{/* GEN:${block} END */}`,
    ].join('\n')
    source =
      source.slice(0, begin.index) +
      generated +
      source.slice(end.index + end[0].length)
  }

  writeFileSync(path, source)
  written += blocks.length
  console.log(`wrote ${file} (${blocks.join(', ')})`)
}

console.log(
  `ok - ${written} tables across ${Object.keys(TARGETS).length} pages: ` +
    `${STEPS.length + RADII.length} named tokens resolved at ${DENSITIES.length} densities, ` +
    `${primitives.length} primitive steps`,
)
