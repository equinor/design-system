import Color from 'colorjs.io'
import { TS_HUES, hueDisplayName } from './tokensStudio'
import type {
  CategoricalConfig,
  SequentialConfig,
  DivergingConfig,
} from './dataviz-types'

/** OKLCH hue (deg) of a Tokens Studio anchor, to one decimal. */
function tokensStudioHue(key: string): number {
  const hue = TS_HUES.find((h) => h.key === key)
  const h = hue ? new Color(hue.anchor).to('oklch').h : NaN
  return h != null && Number.isFinite(h) ? Math.round(h * 10) / 10 : 0
}

/**
 * Seed hues for categorical output, so small palettes start from the EDS
 * hues before the generator extends past them to reach the target count.
 * They are the Tokens Studio hues of the non-neutral tones (accent, danger,
 * warning, success, info); gray and north-sea are left out because they are
 * the neutral hues. North-sea would also sit 2 degrees from blue.
 */
export const EDS_CATEGORICAL_SEEDS: { name: string; hue: number }[] = [
  'moss-green',
  'red',
  'orange',
  'green',
  'blue',
].map((key) => ({ name: hueDisplayName(key), hue: tokensStudioHue(key) }))

export const DEFAULT_CATEGORICAL: CategoricalConfig = {
  kind: 'categorical',
  count: 8,
  lightnessLight: 0.62,
  lightnessDark: 0.72,
  chroma: 0.14,
  minContrastRatio: 3,
  minDeltaE: 0.1,
  enforceCVD: true,
}

export const DEFAULT_SEQUENTIAL: SequentialConfig = {
  kind: 'sequential',
  steps: 7,
  hue: tokensStudioHue('moss-green'), // the accent hue
  lightnessRange: [0.96, 0.34],
  chromaPeak: 0.13,
}

export const DEFAULT_DIVERGING: DivergingConfig = {
  kind: 'diverging',
  steps: 9,
  // Blue ↔ Orange: a CVD-safe pair (never red↔green, which protan/deuteranopia
  // collapse), on the Tokens Studio info and warning hues.
  hueLow: tokensStudioHue('blue'),
  hueHigh: tokensStudioHue('orange'),
  neutralLightness: 0.95,
  endLightness: 0.5,
  chroma: 0.14,
}

/**
 * Inline UI reminders — NOT a maintained canonical palette or formal guidance
 * doc (out of scope per the plan). Just enough to steer usage in the tool.
 */
export const DATAVIZ_HINTS: Record<
  'categorical' | 'sequential' | 'diverging' | 'accessibility',
  string
> = {
  categorical:
    'Distinct categories with no order. Keep to ~8 or fewer where you can — beyond that, colours get hard to tell apart even when CVD-safe; consider grouping or a sequential scale instead.',
  sequential:
    'Ordered values low → high (heatmaps, gradients, magnitude). Read by lightness, so it stays legible in greyscale and for achromatopsia.',
  diverging:
    'Values above / below a meaningful midpoint (e.g. ±, over / under target). Uses a CVD-safe hue pair (blue ↔ orange) through a light neutral.',
  accessibility:
    'Colour alone is never enough — pair it with icons, direct labels, or patterns. 85% of surveyed teams already do.',
}
