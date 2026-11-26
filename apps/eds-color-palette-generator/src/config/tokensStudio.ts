/**
 * Tokens Studio is the source of truth for EDS colour (ADR 0011, ADR 0016).
 *
 * This module reads the Tokens Studio pull that the release workflow commits
 * to `packages/eds-tokens/src/tokens/raw/` and exposes what the generator
 * needs: the seven hue anchors, the hand-set lightness scale, the gaussian
 * chroma parameters, the tone → hue mapping per scheme, and the semantic
 * layer's alias table. The data visualisation colours come from the
 * TypeScript export of the same pull (`ts/`), which holds them as sRGB hex.
 * The inputs of the categorical formula (the base colours, weights and chroma
 * reductions) come from the raw sets, so `/dataviz` can compute the ramps
 * from them and try other inputs.
 *
 * No colour value is typed here. To change one, change it in Tokens Studio;
 * the next release pull updates the JSON and this module follows.
 */
import paletteJson from '../../../../packages/eds-tokens/src/tokens/raw/input/palette.json'
import scaleJson from '../../../../packages/eds-tokens/src/tokens/raw/input/scale.json'
import { theme as lightTheme } from '../../../../packages/eds-tokens/src/tokens/ts/light-comfortable'
import { theme as darkTheme } from '../../../../packages/eds-tokens/src/tokens/ts/dark-comfortable'
import schemeLightJson from '../../../../packages/eds-tokens/src/tokens/raw/scheme/light.json'
import schemeDarkJson from '../../../../packages/eds-tokens/src/tokens/raw/scheme/dark.json'
import semanticJson from '../../../../packages/eds-tokens/src/tokens/raw/semantic.json'
import datavizInputJson from '../../../../packages/eds-tokens/src/tokens/raw/input/dataviz.json'
import colourLightJson from '../../../../packages/eds-tokens/src/tokens/raw/color/light.json'
import colourDarkJson from '../../../../packages/eds-tokens/src/tokens/raw/color/dark.json'

export type Scheme = 'light' | 'dark'

export const SCHEMES: readonly Scheme[] = ['light', 'dark']

/** The six semantic tones (ADR 0016 D6). */
export const TONES = [
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] as const

export type Tone = (typeof TONES)[number]

export const STEP_COUNT = 15

/* ------------------------------------------------------------------ */
/*  Reading the raw token trees                                        */
/* ------------------------------------------------------------------ */

type TokenLeaf = { $value: string | number; $type?: string }
type TokenTree = { [key: string]: TokenTree | TokenLeaf }

function isLeaf(node: TokenTree | TokenLeaf): node is TokenLeaf {
  return '$value' in node
}

function flatten(
  tree: TokenTree,
  prefix: string[] = [],
): [string, TokenLeaf][] {
  return Object.entries(tree).flatMap(([key, node]) => {
    if (key.startsWith('$')) return []
    const path = [...prefix, key]
    return isLeaf(node) ? [[path.join('.'), node]] : flatten(node, path)
  })
}

function subtree(tree: TokenTree, path: string[]): TokenTree {
  return path.reduce((node, key) => node[key] as TokenTree, tree)
}

function numberAt(tree: TokenTree, path: string[]): number {
  const leaf = subtree(tree, path) as unknown as TokenLeaf
  return Number(leaf.$value)
}

/** Tokens Studio writes `oklch(0.4973, 0.084851, 204.553)`; CSS wants spaces. */
function normaliseOklch(value: string): string {
  return value.replace(/\s*,\s*/g, ' ')
}

/** `moss-green` → `Moss Green` */
export function hueDisplayName(key: string): string {
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** `Moss Green` / `moss green` / `moss-green` → `moss-green` */
export function hueKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

/* ------------------------------------------------------------------ */
/*  Scale: lightness and gaussian chroma (input/scale)                 */
/* ------------------------------------------------------------------ */

const scaleTree = subtree(scaleJson as TokenTree, ['input', 'scale'])

const stepNumbers = Array.from({ length: STEP_COUNT }, (_, i) => String(i + 1))

/** Hand-set OKLCH lightness per step and scheme (ADR 0016 D3). */
export const TS_SCALE: Record<Scheme, number[]> = {
  light: stepNumbers.map((n) => numberAt(scaleTree, ['light', n])),
  dark: stepNumbers.map((n) => numberAt(scaleTree, ['dark', n])),
}

/** Gaussian chroma curve per scheme (ADR 0016 D2). */
export const TS_GAUSSIAN: Record<Scheme, { mean: number; stdDev: number }> = {
  light: {
    mean: numberAt(scaleTree, ['gaussian', 'light', 'mean']),
    stdDev: numberAt(scaleTree, ['gaussian', 'light', 'std-dev']),
  },
  dark: {
    mean: numberAt(scaleTree, ['gaussian', 'dark', 'mean']),
    stdDev: numberAt(scaleTree, ['gaussian', 'dark', 'std-dev']),
  },
}

/* ------------------------------------------------------------------ */
/*  Tone → hue mapping (scheme/light, scheme/dark)                     */
/* ------------------------------------------------------------------ */

function toneHues(schemeJson: unknown, scheme: Scheme): Record<Tone, string> {
  const tree = schemeJson as TokenTree
  return Object.fromEntries(
    TONES.map((tone) => {
      // Every step of a tone points at the same hue: `{light.moss-green.1}`
      const leaf = subtree(tree, [tone, '1']) as unknown as TokenLeaf
      const match = String(leaf.$value).match(
        new RegExp(`^\\{${scheme}\\.([a-z-]+)\\.1\\}$`),
      )
      if (!match) {
        throw new Error(`Unexpected scheme alias for ${tone}: ${leaf.$value}`)
      }
      return [tone, match[1]]
    }),
  ) as Record<Tone, string>
}

/** Which hue each tone uses, per scheme (ADR 0016 D7). */
export const TS_TONE_HUE: Record<Scheme, Record<Tone, string>> = {
  light: toneHues(schemeLightJson, 'light'),
  dark: toneHues(schemeDarkJson, 'dark'),
}

/* ------------------------------------------------------------------ */
/*  Hues (input/palette)                                               */
/* ------------------------------------------------------------------ */

export type TsHue = {
  /** Tokens Studio key, e.g. `moss-green` */
  key: string
  /** Display name, e.g. `Moss Green` */
  name: string
  /** The anchor in CSS OKLCH syntax */
  anchor: string
  /** Tones that use this hue, per scheme */
  tones: Record<Scheme, Tone[]>
}

const paletteTree = subtree(paletteJson as TokenTree, ['input', 'palette'])

const hueKeys = Object.keys(paletteTree).filter((key) => !key.startsWith('$'))

// Order hues by the first tone that uses them (accent, neutral, info, …),
// so the accent and neutral hues come first. Hues no tone uses go last.
const toneOrder = (key: string): number => {
  const indices = SCHEMES.flatMap((scheme) =>
    TONES.filter((tone) => TS_TONE_HUE[scheme][tone] === key).map((tone) =>
      TONES.indexOf(tone),
    ),
  )
  return indices.length > 0 ? Math.min(...indices) : TONES.length
}

/** The seven hue anchors, accent and neutral first. */
export const TS_HUES: TsHue[] = hueKeys
  .map((key) => {
    const leaf = subtree(paletteTree, [key, 'anchor']) as unknown as TokenLeaf
    return {
      key,
      name: hueDisplayName(key),
      anchor: normaliseOklch(String(leaf.$value)),
      tones: {
        light: TONES.filter((tone) => TS_TONE_HUE.light[tone] === key),
        dark: TONES.filter((tone) => TS_TONE_HUE.dark[tone] === key),
      },
    }
  })
  .sort(
    (a, b) => toneOrder(a.key) - toneOrder(b.key) || a.key.localeCompare(b.key),
  )

/* ------------------------------------------------------------------ */
/*  Data visualisation (ts/light-comfortable, ts/dark-comfortable)     */
/* ------------------------------------------------------------------ */

type ColourTree = { [key: string]: string | ColourTree }

/** Flattens `{ cat: { 1: { 1: '#…' } } }` to `{ 'dataviz.cat.1.1': '#…' }`. */
function datavizValues(
  tree: ColourTree,
  path: string[] = ['dataviz'],
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]) =>
      typeof value === 'string'
        ? [[[...path, key].join('.'), value]]
        : Object.entries(datavizValues(value, [...path, key])),
    ),
  )
}

/**
 * The data visualisation colours, keyed `dataviz.cat.1.1`, as sRGB hex. They
 * are read from the TypeScript export, not the raw sets: the categorical
 * steps are formulas in Tokens Studio, so the raw sets hold the formula text,
 * while the export holds the evaluated colour, mapped into sRGB where the
 * formula falls outside it. Colour does not change with density, so the
 * comfortable modules stand for every density.
 */
export const TS_DATAVIZ: Record<Scheme, Record<string, string>> = {
  light: datavizValues(lightTheme.dataVisualization),
  dark: datavizValues(darkTheme.dataVisualization),
}

/* ------------------------------------------------------------------ */
/*  Categorical formula inputs (input/dataviz, color/light, color/dark) */
/* ------------------------------------------------------------------ */

/** The categorical steps that Tokens Studio computes from step 3. */
export const DATAVIZ_FORMULA_STEPS = [1, 2, 4, 5] as const

export type DatavizFormulaStep = (typeof DATAVIZ_FORMULA_STEPS)[number]

export type DatavizFormulaInputs = {
  /** The base colour (step 3) of each category as hex, `cat.1` first */
  bases: string[]
  /** How far each step moves from the base towards white or black, 0 to 1 */
  weight: Record<Scheme, Record<DatavizFormulaStep, number>>
  /**
   * How much chroma a step loses at full weight, 0 to 1, for the background
   * side (steps 1 and 2) and the contrast side (steps 4 and 5)
   */
  chromaReduction: Record<Scheme, { background: number; contrast: number }>
}

const datavizInputTree = subtree(datavizInputJson as TokenTree, [
  'input',
  'dataviz',
])

function datavizBases(colourJson: unknown, scheme: Scheme): string[] {
  const cat = subtree(colourJson as TokenTree, [scheme, 'dataviz', 'cat'])
  return Object.keys(cat)
    .filter((key) => !key.startsWith('$'))
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => {
      const leaf = subtree(cat, [key, '3']) as unknown as TokenLeaf
      return String(leaf.$value).toLowerCase()
    })
}

/** The step 3 hex of each category, per scheme, as set in Tokens Studio. */
export const TS_DATAVIZ_BASES: Record<Scheme, string[]> = {
  light: datavizBases(colourLightJson, 'light'),
  dark: datavizBases(colourDarkJson, 'dark'),
}

/**
 * The inputs of the categorical formula in Tokens Studio. Steps 1, 2, 4 and 5
 * of each category are `set_chroma(set_lightness(step 3, L'), C')`, where L'
 * moves the base lightness towards white (`L + w × (1 − L)`) or black
 * (`L × (1 − w)`) by the step's weight w, and C' is the base chroma times
 * `1 − ρ × w` for the side's chroma reduction ρ. In light, steps 1 and 2 move
 * towards white and steps 4 and 5 towards black; dark is the other way round.
 * The base colours are the same in both schemes, and the formula reads the
 * lightness and chroma from the light base (`foundation/dataviz`), so one
 * list stands for both.
 */
export const TS_DATAVIZ_FORMULA: DatavizFormulaInputs = {
  bases: TS_DATAVIZ_BASES.light,
  weight: {
    light: Object.fromEntries(
      DATAVIZ_FORMULA_STEPS.map((step) => [
        step,
        numberAt(datavizInputTree, ['weight', 'light', String(step)]),
      ]),
    ) as Record<DatavizFormulaStep, number>,
    dark: Object.fromEntries(
      DATAVIZ_FORMULA_STEPS.map((step) => [
        step,
        numberAt(datavizInputTree, ['weight', 'dark', String(step)]),
      ]),
    ) as Record<DatavizFormulaStep, number>,
  },
  chromaReduction: {
    light: {
      background: numberAt(datavizInputTree, [
        'chroma-reduction',
        'light',
        'background',
      ]),
      contrast: numberAt(datavizInputTree, [
        'chroma-reduction',
        'light',
        'contrast',
      ]),
    },
    dark: {
      background: numberAt(datavizInputTree, [
        'chroma-reduction',
        'dark',
        'background',
      ]),
      contrast: numberAt(datavizInputTree, [
        'chroma-reduction',
        'dark',
        'contrast',
      ]),
    },
  },
}

/**
 * The formula text of a categorical step in Tokens Studio, keyed
 * `<scheme> <category>.<step>`, so a test can confirm the app computes the
 * same formula.
 */
export const TS_DATAVIZ_FORMULA_TEXT: Record<string, string> =
  Object.fromEntries(
    SCHEMES.flatMap((scheme) => {
      const json = scheme === 'light' ? colourLightJson : colourDarkJson
      const cat = subtree(json as TokenTree, [scheme, 'dataviz', 'cat'])
      return Object.keys(cat)
        .filter((key) => !key.startsWith('$'))
        .flatMap((category) =>
          DATAVIZ_FORMULA_STEPS.map((step) => {
            const leaf = subtree(cat, [
              category,
              String(step),
            ]) as unknown as TokenLeaf
            return [`${scheme} ${category}.${step}`, String(leaf.$value)]
          }),
        )
    }),
  )

/* ------------------------------------------------------------------ */
/*  Semantic layer (semantic.json)                                     */
/* ------------------------------------------------------------------ */

export type SemanticRef =
  | { kind: 'step'; tone: Tone; step: number }
  | { kind: 'dataviz'; path: string }
  | { kind: 'literal'; value: string }

export type SemanticToken = {
  /** Tokens Studio path, e.g. `background.interactive.accent.emphasis.default` */
  path: string
  /** CSS custom property emitted by the Tokens Studio export */
  cssVar: string
  ref: SemanticRef
}

function parseRef(value: string | number): SemanticRef {
  const text = String(value)
  const step = text.match(/^\{([a-z]+)\.(\d+)\}$/)
  if (step && (TONES as readonly string[]).includes(step[1])) {
    return { kind: 'step', tone: step[1] as Tone, step: Number(step[2]) }
  }
  const dataviz = text.match(/^\{(dataviz\.[a-z0-9.]+)\}$/)
  if (dataviz) return { kind: 'dataviz', path: dataviz[1] }
  return { kind: 'literal', value: text }
}

/** Every token in the semantic colour layer, in Tokens Studio order. */
export const TS_SEMANTIC: SemanticToken[] = flatten(
  semanticJson as TokenTree,
).map(([path, leaf]) => ({
  path,
  cssVar: `--eds-${path.replace(/\./g, '-')}`,
  ref: parseRef(leaf.$value),
}))

const semanticByPath = new Map(TS_SEMANTIC.map((token) => [token.path, token]))

export function getSemanticToken(path: string): SemanticToken | undefined {
  return semanticByPath.get(path)
}

/**
 * Replace the tone segment of a semantic path with `<tone>` so the same role
 * across tones collapses to one name, e.g.
 * `text.on-emphasis.danger` → `text.on-emphasis.<tone>`.
 */
export function collapseTone(path: string): string {
  return path
    .split('.')
    .map((segment) =>
      (TONES as readonly string[]).includes(segment) ? '<tone>' : segment,
    )
    .join('.')
}

/**
 * The semantic roles that reference a step. A role that several tones share
 * at this step is collapsed to one `<tone>` name. A role that exists for a
 * single tone keeps its full path, so `text.primary` (always neutral),
 * `border.interactive.focus` (always info) and
 * `background.interactive.neutral.selected.default` (which points at accent)
 * are not mistaken for per-tone roles.
 */
export function rolesForStep(step: number): string[] {
  const tonesByRole = new Map<string, Set<string>>()
  const pathsByRole = new Map<string, string[]>()
  for (const token of TS_SEMANTIC) {
    if (token.ref.kind !== 'step' || token.ref.step !== step) continue
    const pathTone = token.path
      .split('.')
      .find((segment) => (TONES as readonly string[]).includes(segment))
    const role =
      pathTone === token.ref.tone ? collapseTone(token.path) : token.path
    tonesByRole.set(
      role,
      (tonesByRole.get(role) ?? new Set()).add(token.ref.tone),
    )
    pathsByRole.set(role, [...(pathsByRole.get(role) ?? []), token.path])
  }
  return [...tonesByRole.entries()].flatMap(([role, tones]) =>
    tones.size > 1 ? [role] : (pathsByRole.get(role) ?? []),
  )
}
