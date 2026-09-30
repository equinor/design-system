/**
 * Tokens Studio is the source of truth for EDS colour (ADR 0011, ADR 0016).
 *
 * This module reads the Tokens Studio pull that the release workflow commits
 * to `packages/eds-tokens/src/tokens/raw/` and exposes what the generator
 * needs: the seven hue anchors, the hand-set lightness scale, the gaussian
 * chroma parameters, the tone → hue mapping per scheme, and the semantic
 * layer's alias table.
 *
 * No colour value is typed here. To change one, change it in Tokens Studio;
 * the next release pull updates the JSON and this module follows.
 */
import paletteJson from '../../../../packages/eds-tokens/src/tokens/raw/input/palette.json'
import scaleJson from '../../../../packages/eds-tokens/src/tokens/raw/input/scale.json'
import schemeLightJson from '../../../../packages/eds-tokens/src/tokens/raw/scheme/light.json'
import schemeDarkJson from '../../../../packages/eds-tokens/src/tokens/raw/scheme/dark.json'
import semanticJson from '../../../../packages/eds-tokens/src/tokens/raw/semantic.json'

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
