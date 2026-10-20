import Color from 'colorjs.io'
import { gaussian, deltaE } from './color'
import { simulateCVD, CVD_DICHROMACIES } from './cvd'
import {
  minPairContrast,
  minPairDeltaE,
  scoreCVDSafety,
  auditCategorical,
} from './dataviz-a11y'
import { EDS_CATEGORICAL_SEEDS } from '@/config/dataviz-defaults'
import type {
  CategoricalConfig,
  SequentialConfig,
  DivergingConfig,
  ColorMode,
  SwatchColor,
} from '@/config/dataviz-types'

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

/**
 * Build a hex from OKLCH, gamut-mapping into sRGB (CSS Color 4 method) so
 * out-of-gamut hue/chroma combinations reduce chroma cleanly instead of
 * clipping to a muddy colour.
 */
function oklchToHex(l: number, c: number, h: number): string {
  try {
    const mapped = new Color('oklch', [l, c, h]).toGamut({
      space: 'srgb',
      method: 'css',
    })
    const srgb = mapped.to('srgb')
    srgb.alpha = 1
    return srgb.toString({ format: 'hex' })
  } catch {
    return '#808080'
  }
}

function resolveHue(hue: number | string): number {
  if (typeof hue === 'number') return hue
  try {
    const o = new Color(hue).to('oklch')
    return o.h == null || isNaN(o.h) ? 0 : o.h
  } catch {
    return 0
  }
}

/* ------------------------------------------------------------------ */
/*  Categorical (qualitative)                                          */
/* ------------------------------------------------------------------ */

type Candidate = { name: string; hue: number }

/**
 * Distribute the target hues. Small counts stay on the exact EDS seed hues
 * (branded); larger counts extend to evenly spaced hues around the OKLCH
 * wheel, phase-aligned to the first seed hue, so we can reach 15+.
 */
function categoricalHues(cfg: CategoricalConfig): number[] {
  const base =
    cfg.seedHues && cfg.seedHues.length
      ? cfg.seedHues
      : EDS_CATEGORICAL_SEEDS.map((s) => s.hue)
  if (cfg.count <= base.length) return base.slice(0, cfg.count)
  const phase = base[0]
  return Array.from(
    { length: cfg.count },
    (_, i) => (phase + (360 / cfg.count) * i) % 360,
  )
}

/**
 * Each colour represented as [normal, protan, deuter, tritan] hexes. The
 * "worst-case" distance between two colours is the minimum ΔE across these —
 * so a red/green pair that collapses under deuteranopia scores as *close*,
 * even though it looks far apart to normal vision.
 */
function cvdReps(hex: string): string[] {
  return [hex, ...CVD_DICHROMACIES.map((t) => simulateCVD(hex, t))]
}

function worstCaseDistance(repsA: string[], repsB: string[]): number {
  let min = Infinity
  for (let k = 0; k < repsA.length; k++) {
    const d = deltaE(repsA[k], repsB[k], 'OK', true)
    if (d < min) min = d
  }
  return min
}

/**
 * Greedy farthest-point ordering under the worst-case-CVD metric. Colours that
 * collapse under some dichromacy get pushed maximally far apart in the
 * sequence, so the subsequent lightness ramp gives them the biggest luminance
 * gap. `refHex` is the flat-lightness colour used only for the distance metric.
 */
function orderForCVD(cands: Candidate[], refHex: (c: Candidate) => string) {
  if (cands.length <= 2) return cands
  const reps = cands.map((c) => cvdReps(refHex(c)))
  const remaining = cands.map((_, i) => i)
  const order = [remaining.shift() as number]
  while (remaining.length) {
    let bestPos = 0
    let bestScore = -Infinity
    remaining.forEach((idx, pos) => {
      const minDist = Math.min(
        ...order.map((o) => worstCaseDistance(reps[idx], reps[o])),
      )
      if (minDist > bestScore) {
        bestScore = minDist
        bestPos = pos
      }
    })
    order.push(remaining.splice(bestPos, 1)[0])
  }
  return order.map((i) => cands[i])
}

function buildCategorical(
  cands: Candidate[],
  baseL: number,
  chroma: number,
  amplitude: number,
): SwatchColor[] {
  const n = cands.length
  // Linear lightness ramp across the CVD-ordered sequence: collapse-prone
  // pairs (now far apart in order) land at opposite ends → maximal luminance
  // separation. This also makes the palette legible in greyscale
  // (achromatopsia), which colour rotation alone cannot achieve.
  return cands.map((c, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const l = clamp(baseL + amplitude * (t - 0.5) * 2, 0.35, 0.85)
    return { name: c.name, hex: oklchToHex(l, chroma, c.hue) }
  })
}

/**
 * Generate a categorical (qualitative) palette of `cfg.count` distinct,
 * CVD-aware colours for the given mode. Hues rotate around the OKLCH wheel
 * (starting EDS-branded); when `enforceCVD` is set, colours are ordered by
 * worst-case CVD distance and a lightness ramp is tuned so collapse-prone
 * pairs stay separable under protan/deuter/tritan and in greyscale.
 * Distinctness is *reported* by {@link auditCategorical}, not thrown — at high
 * counts perfect separation is impossible, and surfacing that trade-off is
 * more honest than hiding it.
 */
export function generateCategoricalPalette(
  cfg: CategoricalConfig,
  mode: ColorMode,
): SwatchColor[] {
  const baseL = mode === 'dark' ? cfg.lightnessDark : cfg.lightnessLight
  const hues = categoricalHues(cfg)
  const usingSeeds = !cfg.seedHues && cfg.count <= EDS_CATEGORICAL_SEEDS.length
  const cands: Candidate[] = hues.map((hue, i) => ({
    name: usingSeeds ? EDS_CATEGORICAL_SEEDS[i].name : `Series ${i + 1}`,
    hue,
  }))

  const flatHex = (c: Candidate) => oklchToHex(baseL, cfg.chroma, c.hue)

  if (!cfg.enforceCVD) {
    return buildCategorical(cands, baseL, cfg.chroma, 0.06)
  }

  const ordered = orderForCVD(cands, flatHex)
  // Pick the lightness-ramp amplitude that maximises the worst CVD-simulated
  // separation without over-darkening; larger amplitudes help but eventually
  // clip against the gamut / lightness bounds.
  const best = [0.1, 0.16, 0.22, 0.28]
    .map((amplitude) => {
      const colors = buildCategorical(ordered, baseL, cfg.chroma, amplitude)
      const worstCvd = Math.min(
        ...scoreCVDSafety(colors.map((c) => c.hex)).map((s) => s.minDeltaE),
      )
      return { colors, worstCvd }
    })
    .reduce((a, b) => (b.worstCvd > a.worstCvd ? b : a))
  return best.colors
}

/* ------------------------------------------------------------------ */
/*  Sequential (ordered)                                               */
/* ------------------------------------------------------------------ */

/**
 * Generate a single-hue sequential scale (low → high) with a monotonic
 * lightness progression and Gaussian-shaped chroma (peaking mid-ramp, matching
 * the app's UI ramps). Direction flips by mode so low values sit near the
 * background: light → dark in light mode, dark → light in dark mode.
 */
export function generateSequentialScale(
  cfg: SequentialConfig,
  mode: ColorMode,
): SwatchColor[] {
  const h = resolveHue(cfg.hue)
  const steps = Math.max(2, Math.floor(cfg.steps))
  const [lightEnd, darkEnd] = cfg.lightnessRange
  const startL = mode === 'dark' ? 0.3 : lightEnd
  const endL = mode === 'dark' ? 0.92 : darkEnd
  const chromaMean = mode === 'dark' ? 0.7 : 0.6

  return Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1)
    const l = startL + (endL - startL) * t
    const c = cfg.chromaPeak * gaussian(l, chromaMean, 2)
    return { name: `${i + 1}`, hex: oklchToHex(l, c, h) }
  })
}

/* ------------------------------------------------------------------ */
/*  Diverging (± around a midpoint)                                    */
/* ------------------------------------------------------------------ */

/**
 * Generate a diverging scale: two saturated hue ends meeting at a light
 * neutral midpoint. Uses a CVD-safe hue pair (blue ↔ orange by default). The
 * ramp is symmetric about the neutral (equal lightness/chroma either side,
 * mirrored hue). Neutral sits near the background per mode.
 */
export function generateDivergingScale(
  cfg: DivergingConfig,
  mode: ColorMode,
): SwatchColor[] {
  const steps = Math.max(3, Math.floor(cfg.steps))
  const neutralL = mode === 'dark' ? 0.22 : cfg.neutralLightness
  const endL = mode === 'dark' ? 0.68 : cfg.endLightness

  return Array.from({ length: steps }, (_, i) => {
    const p = steps === 1 ? 0.5 : i / (steps - 1)
    const d = Math.abs(p - 0.5) * 2 // 0 at centre, 1 at the ends
    const hue = p <= 0.5 ? cfg.hueLow : cfg.hueHigh
    const l = neutralL + (endL - neutralL) * d
    const c = cfg.chroma * d
    return { name: `${i + 1}`, hex: oklchToHex(l, c, hue) }
  })
}

/* ------------------------------------------------------------------ */
/*  Accessibility scoring (re-exported for a single import surface)    */
/* ------------------------------------------------------------------ */

export { minPairContrast, minPairDeltaE, scoreCVDSafety, auditCategorical }
