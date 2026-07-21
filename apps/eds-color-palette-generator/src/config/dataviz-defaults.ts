import type {
  CategoricalConfig,
  SequentialConfig,
  DivergingConfig,
} from './dataviz-types'

/**
 * OKLCH hues (deg) of the EDS seed colours, so categorical output starts
 * EDS-branded before the generator extends past them to reach the target
 * count. Achromatic Gray is excluded (it has no hue). Values are the OKLCH
 * hue of each seed in src/config/palette.ts (verified via colorjs.io).
 */
export const EDS_CATEGORICAL_SEEDS: { name: string; hue: number }[] = [
  { name: 'Moss Green', hue: 204.9 },
  { name: 'Red', hue: 21.1 },
  { name: 'Orange', hue: 58.7 },
  { name: 'Green', hue: 143.0 },
  { name: 'Blue', hue: 240.7 },
  { name: 'North sea', hue: 252.5 },
]

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
  hue: 204.9, // Moss Green — the brand hue
  lightnessRange: [0.96, 0.34],
  chromaPeak: 0.13,
}

export const DEFAULT_DIVERGING: DivergingConfig = {
  kind: 'diverging',
  steps: 9,
  // Blue ↔ Orange: a CVD-safe pair (never red↔green, which protan/deuteranopia
  // collapse). Blue anchors to North sea, orange to the Orange seed.
  hueLow: 252.5,
  hueHigh: 58.7,
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
