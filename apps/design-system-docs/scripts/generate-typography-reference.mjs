#!/usr/bin/env node
/**
 * Generates every value table on the typography pages, from the token source.
 *
 *   pnpm generate:typography-reference
 *
 * Everything comes from the Tokens Studio output committed in packages/eds-tokens:
 *
 *   dtcg/semantic/default.json     token names, and each token's own CSS custom property
 *                                  (`$extensions["com.figma"].codeSyntax.WEB`)
 *   dtcg/density/<density>.json    which primitive step each density picks
 *   dtcg/primitives/default.json   the type scale and the line-height scale
 *   css/variables.css              the resolved value, per density
 *   ts/semantic/light.ts and ts/density/<density>.ts
 *                                  the TypeScript names the reference page quotes
 *
 * No typography value is ever typed into a page by hand. A text style is two tokens at three
 * densities, so one hand-written row is six chances to be wrong, and nothing in the build would
 * notice.
 *
 * The pages also state rules about the scale: every line-height is a multiple of 4px, body text is
 * at least 1.5 times its font size, density moves one step, and Equinor is one step larger than
 * Inter. Each rule is checked here, and where a rule has exceptions the sentence that names them is
 * generated too, so the prose cannot claim a rule the source has stopped following.
 *
 * Prose columns are the exception, and they live in ROLES and WEIGHTS below rather than in the
 * page, so the generator can refuse to write when a role or a weight has no wording.
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

const readJson = (...parts) =>
  JSON.parse(readFileSync(join(tokens, ...parts), 'utf8'))

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

const webName = (token) =>
  token.$extensions?.['com.figma']?.codeSyntax?.WEB?.replace(
    /^var\(|\)$/g,
    '',
  ) ?? null

const problems = []

// --- the model ---------------------------------------------------------------------------------

const DENSITIES = ['compact', 'comfortable', 'relaxed']

/** Declaration order is the scale's order, and it is not alphabetical. */
const STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

const PROPS = ['font-size', 'line-height']

/**
 * The hand-written part of these pages: what a role is for, and which weights its text styles
 * compose. Neither has a machine-readable source. The weights are the decision in ADR-0027 point 7
 * and live in the Figma text styles, which the token source does not carry: the semantic
 * `typography.*` groups carry only a size and a line-height.
 */
const ROLES = {
  header: {
    family: 'font-family.header',
    weights: ['medium'],
    use: 'titles: the headings of pages and sections',
  },
  label: {
    family: 'font-family.ui',
    weights: ['normal', 'medium', 'bold'],
    use: 'single-line functional text: buttons, navigation, table cells, form labels, captions',
  },
  body: {
    family: 'font-family.ui',
    weights: ['normal', 'bold'],
    use: 'running text that wraps: paragraphs and descriptions',
  },
}

const WEIGHTS = {
  normal: 'the default for label and body text',
  medium: 'every header, and label text that needs emphasis',
  bold: 'strong emphasis in label and body text, and `<strong>` and `<b>` on the web',
}

const FAMILIES = ['font-family.header', 'font-family.ui']

// --- what the package carries -------------------------------------------------------------------

const semantic = readJson('dtcg', 'semantic', 'default.json')

/** `role.step.prop` -> its CSS custom property. */
const typography = new Map()
/** Dotted name -> CSS custom property, for the family and weight tokens. */
const fontTokens = new Map()

for (const [name, token] of walk(semantic)) {
  const web = webName(token)
  if (/^(font-family|font-weight)\./.test(name)) {
    fontTokens.set(name, web)
    if (!web) problems.push(`${name} has no codeSyntax.WEB`)
    continue
  }
  if (!name.startsWith('typography.')) continue
  const [, role, step, prop, ...rest] = name.split('.')
  if (
    rest.length ||
    !ROLES[role] ||
    !STEPS.includes(step) ||
    !PROPS.includes(prop)
  ) {
    problems.push(
      `${name} does not fit typography.<role>.<step>.<prop>, so no page lists it`,
    )
    continue
  }
  if (!web) problems.push(`${name} has no codeSyntax.WEB`)
  // ADR-0027 point 2: the semantic layer is a flat 1:1 alias of the density layer.
  if (token.$value !== `{density.${name}}`) {
    problems.push(`${name} aliases ${token.$value}, not {density.${name}}`)
  }
  typography.set(`${role}.${step}.${prop}`, web)
}

const css = readFileSync(join(tokens, 'css', 'variables.css'), 'utf8')

/**
 * Every block whose selector list names `selector`, merged in source order. The list is split
 * rather than matched as text, because the bundle widens some layers to several selectors.
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

// What an element sees at each density: everything declared at `:root`, with the density block on
// top. Comfortable is the density at `:root`, so it is the base rather than a case.
const base = declarationsOf(':root')
const SCOPES = Object.fromEntries(
  DENSITIES.map((density) => [
    density,
    density === 'comfortable'
      ? base
      : { ...base, ...declarationsOf(`[data-density="${density}"]`) },
  ]),
)

/** Substitutes `var()` references until a value is left. */
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
  return /var\(/.test(value) ? null : value
}

const pxOfCss = (value) => {
  const match = value?.match(/^(\d+(?:\.\d+)?)px$/)
  return match ? Number(match[1]) : null
}

const primitives = readJson('dtcg', 'primitives', 'default.json').primitives

const pxOf = (value) =>
  value && typeof value === 'object' && value.unit === 'px' ? value.value : null

/** Type scale: face -> index -> px. */
const typeScale = {}
for (const face of ['inter', 'equinor']) {
  typeScale[face] = {}
  for (const [index, node] of Object.entries(
    primitives['type-scale']?.[face] ?? {},
  )) {
    typeScale[face][index] = pxOf(node['font-size']?.$value)
  }
}

/** Line-height scale: index -> { spacing: index, px }. */
const lineHeightScale = {}
for (const [index, node] of Object.entries(
  primitives['lineheight-scale'] ?? {},
)) {
  const alias = node.default?.$value?.match(/^\{primitives\.spacing\.(\d+)\}$/)
  if (!alias) {
    problems.push(
      `lineheight-scale.${index} is not an alias of a spacing primitive`,
    )
    continue
  }
  lineHeightScale[index] = {
    spacing: alias[1],
    px: pxOf(primitives.spacing?.[alias[1]]?.$value),
  }
}

/** `density -> role.step.prop -> { face, index }` for font sizes, `{ index }` for line heights. */
const picks = {}
for (const density of DENSITIES) {
  picks[density] = {}
  const set = readJson('dtcg', 'density', `${density}.json`)
  for (const [name, token] of walk(set.density?.typography ?? {})) {
    const font = token.$value.match(
      /^\{primitives\.type-scale\.(inter|equinor)\.(\d+)\.font-size\}$/,
    )
    const line = token.$value.match(
      /^\{primitives\.lineheight-scale\.(\d+)\.default\}$/,
    )
    if (font) picks[density][name] = { face: font[1], index: Number(font[2]) }
    else if (line) picks[density][name] = { index: Number(line[1]) }
    else
      problems.push(
        `density.typography.${name} at ${density} is ${token.$value}, not a primitive`,
      )
  }
}

const FACE = { header: 'equinor', label: 'inter', body: 'inter' }

// --- the model these pages describe -------------------------------------------------------------

/** The steps a role has, in scale order. */
const stepsOf = (role) =>
  STEPS.filter((step) => typography.has(`${role}.${step}.font-size`))

const pick = (density, key) => {
  const found = picks[density][key]
  if (!found || found.index === undefined)
    problems.push(`density.typography.${key} is missing at ${density}`)
  return found ?? {}
}

/** A typography value in px, as a number. */
function px(role, step, prop, density) {
  const value = pxOfCss(
    resolve(density, typography.get(`${role}.${step}.${prop}`)),
  )
  if (typeof value !== 'number') {
    problems.push(
      `typography.${role}.${step}.${prop} does not resolve to px at ${density}`,
    )
    return null
  }
  return value
}

const fontValue = (name) => {
  const value = resolve('comfortable', fontTokens.get(name))
  if (!value) problems.push(`${name} does not resolve`)
  return value
}

// --- checks on the model -------------------------------------------------------------------------

for (const role of Object.keys(ROLES)) {
  if (!stepsOf(role).length)
    problems.push(`typography.${role} is not in the token source`)
  for (const step of stepsOf(role)) {
    if (!typography.has(`${role}.${step}.line-height`)) {
      problems.push(
        `typography.${role}.${step} has a font-size but no line-height`,
      )
    }
  }
  if (!fontTokens.get(ROLES[role].family)) {
    problems.push(
      `${ROLES[role].family}, the family for ${role}, is not in the token source`,
    )
  }
  for (const weight of ROLES[role].weights) {
    if (!WEIGHTS[weight])
      problems.push(`font-weight.${weight} has no wording in WEIGHTS`)
  }
}
for (const name of fontTokens.keys()) {
  if (name.startsWith('font-weight.') && !WEIGHTS[name.slice(12)]) {
    problems.push(
      `${name} exists in the token source but has no wording in WEIGHTS`,
    )
  }
  if (name.startsWith('font-family.') && !FAMILIES.includes(name)) {
    problems.push(`${name} exists in the token source but no page lists it`)
  }
}
for (const weight of Object.keys(WEIGHTS)) {
  if (!fontTokens.get(`font-weight.${weight}`)) {
    problems.push(
      `font-weight.${weight} has wording in WEIGHTS but is not in the token source`,
    )
  }
}

for (const role of Object.keys(ROLES)) {
  for (const step of stepsOf(role)) {
    for (const density of DENSITIES) {
      const { face } = pick(density, `${role}.${step}.font-size`)
      if (face && face !== FACE[role]) {
        problems.push(
          `typography.${role}.${step} at ${density} uses the ${face} scale, not ${FACE[role]}`,
        )
      }
    }
  }
}

// The CSS bundle and the DTCG chain are two exports of one evaluation. A disagreement between
// them means one of the two files is stale, and these pages would be quoting the wrong one.
for (const role of Object.keys(ROLES)) {
  for (const step of stepsOf(role)) {
    for (const density of DENSITIES) {
      const font = pick(density, `${role}.${step}.font-size`)
      const line = pick(density, `${role}.${step}.line-height`)
      const fromChain = [
        typeScale[font.face]?.[font.index],
        lineHeightScale[line.index]?.px,
      ]
      const fromCss = [
        px(role, step, 'font-size', density),
        px(role, step, 'line-height', density),
      ]
      if (fromChain.join() !== fromCss.join()) {
        problems.push(
          `typography.${role}.${step} at ${density} is ${fromCss.join('/')} in the CSS bundle but ` +
            `${fromChain.join('/')} through the DTCG chain`,
        )
      }
    }
  }
}

// --- the rules the pages state -----------------------------------------------------------------

const pair = (role, step, density) => [
  px(role, step, 'font-size', density),
  px(role, step, 'line-height', density),
]

for (const role of Object.keys(ROLES)) {
  for (const step of stepsOf(role)) {
    for (const density of DENSITIES) {
      const [size, line] = pair(role, step, density)
      if (line % 4 !== 0) {
        problems.push(
          `typography.${role}.${step}.line-height is ${line}px at ${density}, not a multiple of 4`,
        )
      }
      if (role === 'body' && line < size * 1.5) {
        problems.push(
          `typography.body.${step} is ${size}/${line} at ${density}, tighter than 1.5`,
        )
      }
      if (role === 'body') {
        const label = typography.has(`label.${step}.font-size`)
          ? px('label', step, 'font-size', density)
          : null
        if (label !== size) {
          problems.push(
            `typography.body.${step}.font-size is ${size}px at ${density}, label has ${label}px`,
          )
        }
      }
    }
    // Density moves the font size one position along the type scale, in both directions.
    const index = Object.fromEntries(
      DENSITIES.map((d) => [d, pick(d, `${role}.${step}.font-size`).index]),
    )
    if (
      index.compact !== index.comfortable - 100 ||
      index.relaxed !== index.comfortable + 100
    ) {
      problems.push(
        `typography.${role}.${step}.font-size picks ${index.compact}/${index.comfortable}/` +
          `${index.relaxed}, which is not one step either side of Comfortable`,
      )
    }
  }
}

for (const name of [
  'font-weight.normal',
  'font-weight.medium',
  'font-weight.bold',
]) {
  if (fontTokens.has(name) && !/^\d+$/.test(fontValue(name) ?? '')) {
    problems.push(`${name} does not resolve to a number`)
  }
}

/**
 * Density uses the size and line-height pair of the next smaller step in Compact and the next larger
 * in Relaxed. Where it does not, the page has to say so, so the exceptions are collected rather than
 * failed, and the sentence that names them is generated.
 */
const pairExceptions = []
for (const role of Object.keys(ROLES)) {
  const steps = stepsOf(role)
  steps.forEach((step, i) => {
    for (const [density, neighbour] of [
      ['compact', steps[i - 1]],
      ['relaxed', steps[i + 1]],
    ]) {
      if (!neighbour) continue
      const shifted = pair(role, step, density)
      const expected = pair(role, neighbour, 'comfortable')
      if (shifted.join() !== expected.join()) {
        pairExceptions.push({
          role,
          step,
          density,
          neighbour,
          shifted,
          expected,
        })
      }
    }
  })
}

/** In header and body, ADR-0027 says one px font size keeps one line-height in every density. */
const lineHeightsBySize = {}
for (const role of Object.keys(ROLES)) {
  lineHeightsBySize[role] = {}
  for (const step of stepsOf(role)) {
    for (const density of DENSITIES) {
      const [size, line] = pair(role, step, density)
      ;(lineHeightsBySize[role][size] ??= new Set()).add(line)
    }
  }
}
const splitSizes = (role) =>
  Object.entries(lineHeightsBySize[role])
    .filter(([, lines]) => lines.size > 1)
    .map(([size, lines]) => ({
      size: Number(size),
      lines: [...lines].sort((a, b) => a - b),
    }))

/** Equinor is one index larger than Inter, except where it is not. */
const faceOffset = []
for (const index of Object.keys(typeScale.equinor)
  .map(Number)
  .sort((a, b) => a - b)) {
  const equinor = typeScale.equinor[index]
  const inter = typeScale.inter[index + 100]
  if (inter !== undefined)
    faceOffset.push({ index, equinor, inter, matches: equinor === inter })
}

// Primitives that no named step uses. They ship in the package and are hidden from the Figma
// picker, so the scale page leaves them out, and this says which ones it left out.
const usedFont = { inter: new Set(), equinor: new Set() }
const usedLine = new Set()
for (const density of DENSITIES) {
  for (const found of Object.values(picks[density])) {
    if (found.face) usedFont[found.face].add(found.index)
    else usedLine.add(found.index)
  }
}
const unused = [
  ...['inter', 'equinor'].flatMap((face) =>
    Object.keys(typeScale[face])
      .map(Number)
      .filter((index) => !usedFont[face].has(index))
      .map((index) => `type-scale.${face}.${index}`),
  ),
  ...Object.keys(lineHeightScale)
    .map(Number)
    .filter((index) => !usedLine.has(index))
    .map((index) => `lineheight-scale.${index}`),
]

// The overview uses `label.md` as its density example: in Compact it is set like Comfortable
// `label.sm`.
if (
  pair('label', 'md', 'compact').join() !==
  pair('label', 'sm', 'comfortable').join()
) {
  problems.push(
    'Compact label.md no longer matches Comfortable label.sm, which the overview says',
  )
}

// The scale page says `header.sm` and `header.md` share a line-height on purpose, and explains why.
if (
  pair('header', 'sm', 'comfortable')[1] !==
  pair('header', 'md', 'comfortable')[1]
) {
  problems.push(
    'header.sm and header.md no longer share a line-height, which the scale page explains',
  )
}

/** Comfortable header steps whose line-height step is above their font-size step. */
const headerPairs = stepsOf('header').map((step) => {
  const font = pick('comfortable', `header.${step}.font-size`)
  const line = pick('comfortable', `header.${step}.line-height`)
  const [size, lineHeight] = pair('header', step, 'comfortable')
  return {
    step,
    size,
    lineHeight,
    fontIndex: font.index,
    lineIndex: line.index,
  }
})
const raised = headerPairs.filter((row) => row.lineIndex > row.fontIndex)

// --- the TypeScript names ----------------------------------------------------------------------

/** Every leaf of a generated TS module, as dotted path -> literal. */
function tsLeaves(file) {
  if (!existsSync(file)) {
    problems.push(`TypeScript export is missing at ${file}`)
    return new Map()
  }
  const src = readFileSync(file, 'utf8')
  const body = src.slice(src.search(/export const \w+ = \{/))
  const stack = []
  const leaves = new Map()
  for (const line of body.split('\n').slice(1)) {
    // An object or array opens a level whether or not it has a key: elevation carries an array of
    // shadow layers, and an unkeyed `{` that is not counted makes its `},` pop the wrong level.
    const open = line.match(/^\s*(?:'?([A-Za-z0-9_-]+)'?:\s*)?[{[]\s*$/)
    if (open) {
      stack.push(open[1] ?? '[]')
      continue
    }
    const leaf = line.match(
      /^\s*'?([A-Za-z0-9_-]+)'?:\s*('([^']*)'|-?[\d.]+),\s*$/,
    )
    if (leaf) {
      leaves.set([...stack, leaf[1]].join('.'), leaf[3] ?? Number(leaf[2]))
      continue
    }
    if (/^\s*[}\]],?\s*$/.test(line)) stack.pop()
  }
  return leaves
}

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

/** The identifier a dotted segment compiles to, as the TS generator writes it. */
const tsSegment = (segment) =>
  segment
    .replace(/^(\d)(.*)$/, (whole, digit, rest) =>
      DIGIT_WORD[digit]
        ? DIGIT_WORD[digit] + rest.slice(0, 1).toUpperCase() + rest.slice(1)
        : whole,
    )
    .split('-')
    .map((word, i) =>
      i === 0 ? word : word.slice(0, 1).toUpperCase() + word.slice(1),
    )
    .join('')

const tsPath = (dotted) => dotted.split('.').map(tsSegment).join('.')

// The reference page quotes TypeScript paths and their values. Both are claims about generated
// output, so each one is read back, with its value, rather than restated.
const tsSemantic = tsLeaves(join(tokens, 'ts', 'semantic', 'light.ts'))
const tsDensity = Object.fromEntries(
  DENSITIES.map((d) => [d, tsLeaves(join(tokens, 'ts', 'density', `${d}.ts`))]),
)

for (const role of Object.keys(ROLES)) {
  for (const step of stepsOf(role)) {
    for (const prop of PROPS) {
      const path = tsPath(`typography.${role}.${step}.${prop}`)
      if (tsSemantic.get(path) !== px(role, step, prop, 'comfortable')) {
        problems.push(
          `semantic TypeScript has ${path} = ${tsSemantic.get(path)}, not the Comfortable value`,
        )
      }
      for (const density of DENSITIES) {
        if (tsDensity[density].get(path) !== px(role, step, prop, density)) {
          problems.push(
            `${density} TypeScript has ${path} = ${tsDensity[density].get(path)}`,
          )
        }
      }
    }
  }
}
for (const name of fontTokens.keys()) {
  const path = tsPath(name)
  const expected = fontValue(name)
  const found = tsSemantic.get(path)
  if (String(found) !== String(expected)) {
    problems.push(
      `semantic TypeScript has ${path} = ${found}, the CSS bundle has ${expected}`,
    )
  }
}

// --- tables ------------------------------------------------------------------------------------

const code = (text) => `\`${text}\``
const cell = (role, step, density) => {
  if (!typography.has(`${role}.${step}.font-size`)) return '–'
  const [size, line] = pair(role, step, density)
  return `${size} / ${line}`
}
const familyName = (role) => fontValue(ROLES[role].family)
const range = (role) => {
  const steps = stepsOf(role)
  return `${code(steps[0])} to ${code(steps.at(-1))}`
}
const allSteps = STEPS.filter((step) =>
  Object.keys(ROLES).some((role) => stepsOf(role).includes(step)),
)
const ratio = (role, step) => {
  if (!typography.has(`${role}.${step}.font-size`)) return '–'
  const [size, line] = pair(role, step, 'comfortable')
  return (line / size).toFixed(2)
}
const list = (items) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`

const tables = {}

tables['typography-roles'] = [
  '| Role | Typeface | Steps | Weights | Use it for |',
  '| --- | --- | --- | --- | --- |',
  ...Object.entries(ROLES).map(
    ([role, info]) =>
      `| ${code(`typography.${role}`)} | ${familyName(role)} | ${range(role)} | ${info.weights.map(code).join(', ')} | ${info.use} |`,
  ),
]

tables['typography-steps'] = [
  '| Step | `header` | `label` | `body` |',
  '| --- | --- | --- | --- |',
  ...allSteps.map(
    (step) =>
      `| ${code(step)} | ${Object.keys(ROLES)
        .map((role) => cell(role, step, 'comfortable'))
        .join(' | ')} |`,
  ),
]

tables['typography-weights'] = [
  '| Token | CSS custom property | Value | Use it for |',
  '| --- | --- | --- | --- |',
  ...Object.keys(WEIGHTS).map((weight) => {
    const name = `font-weight.${weight}`
    return `| ${code(name)} | ${code(fontTokens.get(name))} | ${fontValue(name)} | ${WEIGHTS[weight]} |`
  }),
]

tables['typography-families'] = [
  '| Token | CSS custom property | Typeface | Used by |',
  '| --- | --- | --- | --- |',
  ...FAMILIES.map((name) => {
    const roles = Object.keys(ROLES).filter(
      (role) => ROLES[role].family === name,
    )
    return `| ${code(name)} | ${code(fontTokens.get(name))} | ${fontValue(name)} | ${roles.map(code).join(' and ')} |`
  }),
]

const scaleIndices = [
  ...new Set([...usedFont.inter, ...usedFont.equinor]),
].sort((a, b) => a - b)

tables['type-scale'] = [
  '| Index | `inter` | `equinor` |',
  '| --- | --- | --- |',
  ...scaleIndices.map(
    (index) =>
      `| ${code(index)} | ${usedFont.inter.has(index) ? `${typeScale.inter[index]}px` : '–'} | ${usedFont.equinor.has(index) ? `${typeScale.equinor[index]}px` : '–'} |`,
  ),
]

const offsetMatches = faceOffset.filter(
  (row) => row.matches && usedFont.equinor.has(row.index),
)
const offsetBreaks = faceOffset.filter(
  (row) => !row.matches && usedFont.equinor.has(row.index),
)
tables['type-scale-offset'] = [
  `Of the ${offsetMatches.length + offsetBreaks.length} Equinor steps in use, ${offsetMatches.length} are ` +
    'the same size as the Inter step one index up' +
    (offsetBreaks.length
      ? `. The ${offsetBreaks.length === 1 ? 'exception is' : 'exceptions are'} ` +
        list(
          offsetBreaks.map(
            (row) =>
              `${code(row.index)}, where Equinor is ${row.equinor}px and Inter ${code(row.index + 100)} is ${row.inter}px`,
          ),
        ) +
        '.'
      : ', with no exceptions.'),
]

tables['lineheight-scale'] = [
  '| Line-height step | Spacing primitive | px |',
  '| --- | --- | --- |',
  ...[...usedLine]
    .sort((a, b) => a - b)
    .map(
      (index) =>
        `| ${code(index)} | ${code(`spacing.${lineHeightScale[index].spacing}`)} | ${lineHeightScale[index].px}px |`,
    ),
]

const describeException = (e) =>
  `${e.density[0].toUpperCase()}${e.density.slice(1)} ${code(`${e.role}.${e.step}`)} is ${e.shifted.join('/')}, where Comfortable ` +
  `${code(`${e.role}.${e.neighbour}`)} is ${e.expected.join('/')}`

tables['density-exceptions'] = [
  pairExceptions.length
    ? `The rule has ${pairExceptions.length === 1 ? 'one exception' : `${pairExceptions.length} exceptions`}: ` +
      `${list(pairExceptions.map(describeException))}.`
    : 'The rule has no exceptions.',
]

const keepsLine = Object.keys(ROLES).filter((role) => !splitSizes(role).length)
const splitsLine = Object.keys(ROLES).filter((role) => splitSizes(role).length)
tables['shared-line-height'] = [
  (keepsLine.length
    ? `In ${list(keepsLine.map(code))}, a font size has the same line height in every density. `
    : '') +
    splitsLine
      .map(
        (role) =>
          `In ${code(role)}, ${list(
            splitSizes(role).map(
              (s) =>
                `${s.size}px has ${s.lines.length === 2 ? 'two' : s.lines.length}: ${list(s.lines.map((l) => `${l}px`))}`,
            ),
          )}.`,
      )
      .join(' '),
]

tables['header-pairs'] = [
  `In ${raised.length} of the ${headerPairs.length} header steps, the line-height step is above the font-size step:`,
  '',
  '| Step | Font size | Type-scale step | Line height | Line-height step |',
  '| --- | --- | --- | --- | --- |',
  ...headerPairs.map(
    (row) =>
      `| ${code(`header.${row.step}`)} | ${row.size}px | ${code(row.fontIndex)} | ${row.lineHeight}px | ${row.lineIndex > row.fontIndex ? `**${code(row.lineIndex)}**` : code(row.lineIndex)} |`,
  ),
]

{
  const font = pick('comfortable', 'label.md.font-size')
  const line = pick('comfortable', 'label.md.line-height')
  tables['line-height-chain'] = [
    '```',
    `typography.label.md.line-height                 what you use`,
    `  → density.typography.label.md.line-height     a different step per density`,
    `    → primitives.lineheight-scale.${line.index}.default`,
    `      → primitives.spacing.${lineHeightScale[line.index]?.spacing}`,
    '```',
  ]
  if (font.face !== 'inter') problems.push('label.md is not on the Inter scale')
}

tables['line-height-ratios'] = [
  '| Step | `header` | `label` | `body` |',
  '| --- | --- | --- | --- |',
  ...allSteps.map(
    (step) =>
      `| ${code(step)} | ${Object.keys(ROLES)
        .map((role) => ratio(role, step))
        .join(' | ')} |`,
  ),
]

for (const role of Object.keys(ROLES)) {
  tables[`specimen-${role}`] = [
    `<TypeScale role="${role}" steps={[${stepsOf(role)
      .map((s) => `'${s}'`)
      .join(', ')}]} />`,
  ]
}

const tokenCount = typography.size + fontTokens.size
const example = {
  size: tsPath('typography.label.md.font-size'),
  twoXl: tsPath('typography.header.2xl.line-height'),
  weight: tsPath('font-weight.medium'),
}

tables['token-reference'] = [
  `**${tokenCount} tokens.** ${typography.size} size and line-height tokens, which have one value per`,
  `density, and ${fontTokens.size} family and weight tokens, which have one value everywhere. The`,
  '**Token** column is the name you pick in Figma and the **CSS custom property** column is the same',
  'token in code. Both come from the token definition itself, so they cannot drift apart. The',
  '**Comfortable** column is what you get with no `data-density` attribute set.',
  '',
  ...Object.keys(ROLES).flatMap((role) => [
    `## ${role[0].toUpperCase()}${role.slice(1)}`,
    '',
    `${stepsOf(role).length} steps, ${range(role)}, set in ${familyName(role)}. Values in px.`,
    '',
    '| Token | CSS custom property | Compact | Comfortable | Relaxed |',
    '| --- | --- | --- | --- | --- |',
    ...stepsOf(role).flatMap((step) =>
      PROPS.map((prop) => {
        const name = `typography.${role}.${step}.${prop}`
        const cssName = typography.get(`${role}.${step}.${prop}`)
        return `| ${code(name)} | ${code(cssName)} | ${DENSITIES.map((d) => px(role, step, prop, d)).join(' | ')} |`
      }),
    ),
    '',
  ]),
  '## Family and weight',
  '',
  'These do not change with density.',
  '',
  '| Token | CSS custom property | Value |',
  '| --- | --- | --- |',
  ...[...FAMILIES, ...Object.keys(WEIGHTS).map((w) => `font-weight.${w}`)].map(
    (name) =>
      `| ${code(name)} | ${code(fontTokens.get(name))} | ${fontValue(name)} |`,
  ),
  '',
  '## In TypeScript',
  '',
  'The tokens also ship as TypeScript objects, for the places a CSS custom property cannot reach. A',
  'name segment that starts with a digit becomes a word, and a hyphenated segment is camel-cased, so',
  `${code('typography.header.2xl.line-height')} is ${code(example.twoXl)}.`,
  '',
  '```ts',
  "import { semantic } from '@equinor/eds-tokens/next/ts/semantic/light'",
  '',
  `semantic.${example.size} // ${px('label', 'md', 'font-size', 'comfortable')}`,
  `semantic.${example.twoXl} // ${px('header', '2xl', 'line-height', 'comfortable')}`,
  `semantic.${example.weight} // ${fontValue('font-weight.medium')}`,
  '```',
  '',
  'The `next/` paths are temporary for the beta line. Two differences from the CSS form, both easy',
  'to miss:',
  '',
  '- **The values are unitless numbers, not lengths.** `14`, not `14px`. Add the unit yourself.',
  '- **`semantic` is frozen at Comfortable.** There is no attribute for an object to read, so the',
  '  densities are separate modules and you pick one:',
  '',
  '```ts',
  "import { density } from '@equinor/eds-tokens/next/ts/density/compact'",
  '',
  `density.${example.size} // ${px('label', 'md', 'font-size', 'compact')}`,
  '```',
  '',
  'The family and weight tokens are only in `semantic`, because they do not change with density.',
]

if (problems.length) {
  console.error(`${problems.length} problem(s), refusing to write:`)
  ;[...new Set(problems)].forEach((p) => console.error(`  ${p}`))
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
        .map((c) => c.trim()),
    )
    // Row 1 is the `| --- |` separator, which takes the width rather than setting it
    const widths = rows[0].map((_, col) =>
      Math.max(
        3,
        ...rows.filter((_, r) => r !== 1).map((row) => row[col].length),
      ),
    )
    for (const [r, row] of rows.entries()) {
      const cells = row.map((c, col) =>
        r === 1 ? '-'.repeat(widths[col]) : c.padEnd(widths[col]),
      )
      out.push(`| ${cells.join(' | ')} |`)
    }
    i = end - 1
  }
  return out
}

const TARGETS = {
  'typography.mdx': [
    'typography-roles',
    'typography-steps',
    'typography-weights',
    'typography-families',
  ],
  'typography-scale.mdx': [
    'specimen-header',
    'specimen-label',
    'specimen-body',
    'type-scale',
    'type-scale-offset',
    'lineheight-scale',
    'density-exceptions',
    'shared-line-height',
    'line-height-chain',
    'header-pairs',
    'line-height-ratios',
  ],
  'typography-reference.mdx': ['token-reference'],
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
      `{/* GEN:${block} BEGIN - regenerate with pnpm generate:typography-reference. Do not edit by hand. */}`,
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
  `ok - ${written} blocks across ${Object.keys(TARGETS).length} pages` +
    ': ' +
    `${typography.size} typography tokens resolved at ${DENSITIES.length} densities, ` +
    `${fontTokens.size} family and weight tokens, ` +
    `${pairExceptions.length} density exception(s), ` +
    `${unused.length} primitive(s) no named step uses (${unused.join(', ') || 'none'})`,
)
