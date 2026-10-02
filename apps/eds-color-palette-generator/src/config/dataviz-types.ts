/**
 * Data-visualisation palette model.
 *
 * This lives ALONGSIDE the 15-step UI-token model (config.ts / types.ts) and
 * never references StepDefinition, so the UI-token engine cannot regress. The
 * three families cover the survey's three usage buckets: categorical (distinct
 * categories), sequential (ordered data values), and diverging (± around a
 * midpoint).
 */

export type DatavizKind = 'categorical' | 'sequential' | 'diverging'

export type ColorMode = 'light' | 'dark'

export type CategoricalConfig = {
  kind: 'categorical'
  /** Target number of distinct series colours (supports 15+). */
  count: number
  /** Optional explicit OKLCH hue anchors (deg). Defaults to the EDS seed hues. */
  seedHues?: number[]
  /** OKLCH lightness of the series in light / dark mode. */
  lightnessLight: number
  lightnessDark: number
  /** OKLCH chroma of the series. */
  chroma: number
  /** Minimum WCAG contrast ratio between the closest pair (default 3). */
  minContrastRatio: number
  /** Minimum OKLab ΔE between any pair (default ~0.1). */
  minDeltaE: number
  /** Enforce CVD-simulated separation (protan / deuter / tritan). */
  enforceCVD: boolean
}

export type SequentialConfig = {
  kind: 'sequential'
  /** Number of stops — decoupled from the 15 UI steps. */
  steps: number
  /** Hue in degrees, or a colour string to read the hue from. */
  hue: number | string
  /** [lightEnd, darkEnd] OKLCH lightness. */
  lightnessRange: [number, number]
  /** Peak chroma (shaped by a Gaussian across the ramp). */
  chromaPeak: number
}

export type DivergingConfig = {
  kind: 'diverging'
  /** Number of stops — odd keeps a single neutral midpoint. */
  steps: number
  /** Low-end hue (deg). Must stay CVD-distinguishable from hueHigh. */
  hueLow: number
  /** High-end hue (deg). */
  hueHigh: number
  /** OKLCH lightness of the neutral midpoint. */
  neutralLightness: number
  /** OKLCH lightness of the two saturated ends. */
  endLightness: number
  /** Peak chroma of each half-ramp. */
  chroma: number
}

export type DatavizConfig =
  | CategoricalConfig
  | SequentialConfig
  | DivergingConfig

/** A generated data-viz colour ready to render as a swatch / chart series. */
export type SwatchColor = {
  name: string
  hex: string
}
