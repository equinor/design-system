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
 * Prose columns are the exception, and they live in ROLES below rather than in the page, so the
 * generator can refuse to write a table with a step it has no wording for. That is the failure a
 * generated table would otherwise hide: a new step appears with an empty cell beside it.
 *
 * Only the regions between markers are rewritten. Prose outside them is preserved.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  PENDING_ISSUE,
  PENDING_STEPS,
  pendingPrimitives,
} from './pending-spacing-steps.mjs'

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
 * Every `:root` block merged, then the density block layered on top. Comfortable is emitted at
 * `:root` with no selector of its own, so it is the base rather than a case.
 */
function declarationsOf(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const merged = {}
  for (const block of css.matchAll(
    new RegExp(escaped + '\\s*\\{([\\s\\S]*?)\\n\\}', 'g'),
  )) {
    for (const m of block[1].matchAll(/(--eds-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      merged[m[1]] = m[2].trim()
    }
  }
  return merged
}

const base = declarationsOf(':root')
const DENSITIES = ['compact', 'comfortable', 'relaxed']
const SCOPES = Object.fromEntries(
  DENSITIES.map((density) => [
    density,
    {
      ...base,
      ...declarationsOf(`[data-color-scheme]`),
      ...(density === 'comfortable'
        ? {}
        : declarationsOf(`[data-density="${density}"]`)),
    },
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
]

/** Steps the package does not carry yet. Their values come from the primitives they point at. */
const isPending = (step) =>
  step in PENDING_STEPS && !named.has(`spacing.${step}`)

/** Marks a pending step in a table cell, so no row claims to be shipped when it is not. */
const mark = (step) => (isPending(step) ? ' †' : '')
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
  xl: 'separating sections',
  '2xl': 'page-level rhythm, in layouts rather than components',
  '3xl': 'page-level rhythm, wider than a component has a use for',
  '4xl': 'layout: the gap between major regions of a page',
  '5xl': 'layout: separating whole sections of a long page',
  '6xl': 'layout: the widest step, for full-page composition',
}

const RADIUS_ROLES = {
  none: 'full-bleed edges and table cells',
  rounded: 'the default: buttons, inputs, chips',
  'rounded-outer':
    'nothing, in code. It exists so Figma can draw the focus ring, which CSS derives from `outline-offset`',
  pill: 'fully round ends: pills, avatars, toggles',
}

const problems = []

for (const step of STEPS) {
  if (!named.has(`spacing.${step}`) && !(step in PENDING_STEPS))
    problems.push(`spacing.${step} is not in the token source`)
  if (!ROLES[step]) problems.push(`spacing.${step} has no wording in ROLES`)
}

// A pending step that has arrived in the package is checked against what this file claimed its
// value would be, and then has to be taken off the pending list. Without this, a wrong index
// would publish as a correct-looking value, and a shipped step would keep rendering the
// "not in the package yet" note forever.
for (const [step, densities] of Object.entries(PENDING_STEPS)) {
  const name = `spacing.${step}`
  if (!named.has(name)) continue
  for (const [density, index] of Object.entries(densities)) {
    const fromSource = resolve(density, named.get(name))
    const fromPending = base[`--eds-primitives-spacing-${index}`]
    if (fromSource !== fromPending) {
      problems.push(
        `${name} at ${density} is ${fromSource} in the package but pending-spacing-steps.mjs ` +
          `claims primitive ${index} (${fromPending})`,
      )
    }
  }
  problems.push(
    `${name} is in the package now: remove it from scripts/pending-spacing-steps.mjs, ` +
      `drop the pending note from the pages, and delete the file once it is empty`,
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
  // A pending step has no token in the source to resolve, but the primitive it points at ships,
  // so the measurement still comes from the package rather than from a number typed in a page.
  const step = name.replace(/^spacing\./, '')
  if (isPending(step)) {
    const index = PENDING_STEPS[step][density]
    const resolved = base[`--eds-primitives-spacing-${index}`]
    if (!resolved)
      problems.push(
        `primitive ${index} for pending ${name} is not in the package`,
      )
    return resolved
  }
  const cssName = named.get(name)
  const resolved = cssName ? resolve(density, cssName) : null
  if (!resolved) problems.push(`${name} does not resolve at ${density}`)
  return resolved
}

/** The custom property a step compiles to. Pending steps have no codeSyntax to read yet. */
const cssNameOf = (name) =>
  named.get(name) ?? `--eds-${name.replaceAll('.', '-')}`

// --- the primitive scale -----------------------------------------------------------------------

const primitives = [
  ...css.matchAll(/--eds-primitives-spacing-(\d+)\s*:\s*([\d.]+)px\s*;/g),
]
  .map((m) => ({ index: Number(m[1]), px: Number(m[2]) }))
  .sort((a, b) => a.index - b.index)

/** Which primitive steps anything in the bundle points at. The rest are defined and unused. */
const referenced = new Set(
  [...css.matchAll(/var\(--eds-primitives-spacing-(\d+)\)/g)].map((m) =>
    Number(m[1]),
  ),
)

/** Primitives pointed at only by a pending step, so the page does not call them unused. */
const pendingRefs = new Set(
  [...pendingPrimitives()].filter((index) => !referenced.has(index)),
)

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

const DIGIT_WORD = { 2: 'two', 3: 'three', 4: 'four' }

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

const pendingNow = STEPS.filter(isPending)

tables['spacing-steps'] = [
  '| Step | Comfortable | Reach for it when |',
  '| --- | --- | --- |',
  ...STEPS.map(
    (step) =>
      `| \`spacing.${step}\`${mark(step)} | ${value(`spacing.${step}`, 'comfortable')} | ${ROLES[step]} |`,
  ),
  ...(pendingNow.length
    ? [
        '',
        `\`†\` ${pendingNow.map((step) => '`' + step + '`').join(', ')} ${pendingNow.length === 1 ? 'is' : 'are'} decided and merged in Tokens Studio, but ${pendingNow.length === 1 ? 'is' : 'are'} not in`,
        `\`@equinor/eds-tokens\` yet. The values are resolved from the primitives they point at, which do ship.`,
        `Release tracked in [equinor/design-system#${PENDING_ISSUE}](https://github.com/equinor/design-system/issues/${PENDING_ISSUE}).`,
      ]
    : []),
]

tables['radius-steps'] = [
  '| Token | Comfortable | Use for |',
  '| --- | --- | --- |',
  ...RADII.map(
    (radius) =>
      `| \`corner-radius.${radius}\` | ${value(`corner-radius.${radius}`, 'comfortable')} | ${RADIUS_ROLES[radius]} |`,
  ),
]

/** The values the three densities draw from, in order. `none` is excluded: it never moves. */
const shared = [
  ...new Set(
    STEPS.filter((step) => step !== 'none').flatMap((step) =>
      DENSITIES.map((density) => px(value(`spacing.${step}`, density))),
    ),
  ),
].sort((a, b) => a - b)

const position = (name, density) => {
  const found = shared.indexOf(px(value(name, density)))
  return found === -1 ? '' : ` (${found + 1})`
}

tables['density-spacing'] = [
  '| Step | Compact | Comfortable | Relaxed |',
  '| --- | --- | --- | --- |',
  ...STEPS.map((step) => {
    const name = `spacing.${step}`
    const cells = DENSITIES.map(
      (density) =>
        `${value(name, density)}${step === 'none' ? '' : position(name, density)}`,
    )
    return `| \`${name}\`${mark(step)} | ${cells.join(' | ')} |`
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

// Prose rather than a code block or a table: 13 values is too many columns to read across, and a
// single-line code block scrolls sideways out of the content column.
tables['shared-spacing-scale'] = [
  `The ${shared.length} values the ${STEPS.length - 1} steps other than \`none\` are assigned from,`,
  'numbered by position:',
  '',
  shared.map((v, i) => `**${i + 1}.** \`${v}px\``).join(' · '),
]

/** Three index/px pairs per row, so 43 steps do not become 43 screen-heights. */
const COLUMNS = 3
const rows = Math.ceil(primitives.length / COLUMNS)
tables['primitive-scale'] = [
  `| ${Array.from({ length: COLUMNS }, () => 'Index | px').join(' | ')} |`,
  `| ${Array.from({ length: COLUMNS * 2 }, () => '---').join(' | ')} |`,
  ...Array.from({ length: rows }, (_, row) => {
    const cells = Array.from({ length: COLUMNS }, (_, column) => {
      const step = primitives[column * rows + row]
      if (!step) return ' | '
      const marker = referenced.has(step.index)
        ? ''
        : pendingRefs.has(step.index)
          ? ' †'
          : ' *'
      return `\`${step.index}\`${marker} | ${step.px}px`
    })
    return `| ${cells.join(' | ')} |`
  }),
  '',
  `\`*\` marks a step nothing points at: ${primitives.filter((p) => !referenced.has(p.index) && !pendingRefs.has(p.index)).length} of ${primitives.length}.` +
    (pendingRefs.size
      ? ` \`†\` marks the ${pendingRefs.size} pointed at only by the steps not in the package yet.`
      : ''),
]

tables['token-reference'] = [
  `**${STEPS.length + RADII.length} tokens.** Each one has three values, one per density. The **Token**`,
  'column is the name you pick in Figma and the **CSS custom property** column is the same token in',
  'code. Both come from the token definition itself, so they cannot drift apart. The **Comfortable**',
  'column is what you get with no `data-density` attribute set.',
  ...(pendingNow.length
    ? [
        '',
        `\`†\` marks a token that is merged in Tokens Studio but not in \`@equinor/eds-tokens\` yet, so it`,
        'has no custom property to bind to until the next token release. The values shown are resolved',
        'from the primitives it points at, which do ship. Tracked in',
        `[equinor/design-system#${PENDING_ISSUE}](https://github.com/equinor/design-system/issues/${PENDING_ISSUE}).`,
      ]
    : []),
  '',
  '## Spacing',
  '',
  `${STEPS.length} steps, applied to \`padding\`, \`gap\` and \`margin\`.`,
  '',
  '| Token | CSS custom property | Compact | Comfortable | Relaxed |',
  '| --- | --- | --- | --- | --- |',
  ...STEPS.map((step) => {
    const name = `spacing.${step}`
    return `| \`${name}\`${mark(step)} | \`${cssNameOf(name)}\` | ${DENSITIES.map((d) => value(name, d)).join(' | ')} |`
  }),
  '',
  '## Corner radius',
  '',
  `${RADII.length} tokens, in the same density collection as spacing.`,
  '',
  '| Token | CSS custom property | Compact | Comfortable | Relaxed |',
  '| --- | --- | --- | --- | --- |',
  ...RADII.map((radius) => {
    const name = `corner-radius.${radius}`
    return `| \`${name}\` | \`${cssNameOf(name)}\` | ${DENSITIES.map((d) => value(name, d)).join(' | ')} |`
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
  'So prefer the CSS custom properties wherever they work. Reach for the TypeScript objects only',
  'where they do not, and expect to handle density yourself when you do.',
]

if (problems.length) {
  console.error(`${problems.length} problem(s), refusing to write:`)
  problems.forEach((p) => console.error(`  ${p}`))
  process.exit(1)
}

// --- write, between the markers ----------------------------------------------------------------

const TARGETS = {
  'spacing.mdx': ['spacing-steps', 'radius-steps'],
  'spacing-scale.mdx': [
    'primitive-scale',
    'shared-spacing-scale',
    'density-spacing',
    'density-radius',
  ],
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
      tables[block].join('\n'),
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
    `${STEPS.length + RADII.length} named tokens resolved at ${DENSITIES.length} densities ` +
    `(${pendingNow.length} not in the package yet), ` +
    `${primitives.length} primitive steps, ${referenced.size} of them referenced`,
)
