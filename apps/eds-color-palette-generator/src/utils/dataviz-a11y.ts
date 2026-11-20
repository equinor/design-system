import { contrast, contrastValue, deltaE } from './color'
import { simulateCVD, CVD_DICHROMACIES } from './cvd'
import type { CategoricalConfig, SwatchColor } from '@/config/dataviz-types'

/**
 * Fraction of the normal-vision ΔE floor that must survive under each
 * dichromacy. CVD always compresses separation, so we allow some loss: a
 * well-formed small palette stays comfortably above this, while over-crowded
 * palettes fall below it and are reported as unsafe.
 */
export const CVD_TOLERANCE = 0.6

/** Minimum WCAG21 contrast ratio across every unordered colour pair. */
export function minPairContrast(colors: string[]): number {
  if (colors.length < 2) return Infinity
  let min = Infinity
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const ratio = Number(
        contrast({
          foreground: colors[i],
          background: colors[j],
          algorithm: 'WCAG21',
          silent: true,
        }),
      )
      if (ratio < min) min = ratio
    }
  }
  return min
}

/** Minimum perceptual ΔE across every unordered colour pair. */
export function minPairDeltaE(
  colors: string[],
  method: '2000' | 'OK' = 'OK',
): number {
  if (colors.length < 2) return Infinity
  let min = Infinity
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const d = deltaE(colors[i], colors[j], method, true)
      if (d < min) min = d
    }
  }
  return min
}

export type CVDScore = {
  type: (typeof CVD_DICHROMACIES)[number]
  minDeltaE: number
  worstPair: [number, number]
}

/**
 * For each dichromacy, simulate all colours and find the least-separated pair.
 * A low minDeltaE means two series would look alike to that viewer.
 */
export function scoreCVDSafety(colors: string[]): CVDScore[] {
  return CVD_DICHROMACIES.map((type) => {
    const simulated = colors.map((c) => simulateCVD(c, type))
    let minDeltaE = Infinity
    let worstPair: [number, number] = [0, 0]
    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        const d = deltaE(simulated[i], simulated[j], 'OK', true)
        if (d < minDeltaE) {
          minDeltaE = d
          worstPair = [i, j]
        }
      }
    }
    return { type, minDeltaE, worstPair }
  })
}

export type CategoricalAudit = {
  /** Closest-pair perceptual ΔE meets cfg.minDeltaE (authoritative gate). */
  passesDeltaE: boolean
  /** Every dichromacy keeps pairs distinguishable (authoritative gate). */
  cvdSafe: boolean
  minDeltaE: number
  cvd: CVDScore[]
  /**
   * Closest-pair WCAG ratio — INFORMATIONAL only. Categorical series are
   * distinguished by hue, so iso-luminant colours legitimately sit near 1:1;
   * luminance contrast is the wrong distinctness metric here (it belongs to
   * colour-vs-background checks, WCAG 1.4.11), so it never fails the audit.
   */
  minContrast: number
  /** Human-readable descriptions of any failed gate. */
  failures: string[]
}

/**
 * Audit a generated categorical palette against its distinctness gates:
 * closest-pair perceptual ΔE and CVD-simulated separation across
 * protan/deuter/tritan. Returns a structured report rather than throwing, so
 * the UI can show exactly which gate failed and by how much — at high counts
 * perfect separation is impossible, and surfacing that beats hiding it.
 */
export function auditCategorical(
  colors: SwatchColor[],
  cfg: CategoricalConfig,
): CategoricalAudit {
  const hexes = colors.map((c) => c.hex)
  const minContrast = minPairContrast(hexes)
  const minDeltaE = minPairDeltaE(hexes)
  const cvd = scoreCVDSafety(hexes)

  const cvdFloor = cfg.minDeltaE * CVD_TOLERANCE
  const passesDeltaE = minDeltaE >= cfg.minDeltaE
  const cvdSafe = !cfg.enforceCVD || cvd.every((s) => s.minDeltaE >= cvdFloor)

  const failures: string[] = []
  if (!passesDeltaE) {
    failures.push(
      `Closest pair ΔE ${minDeltaE.toFixed(3)} is below the ${cfg.minDeltaE} distinctness floor — colours may be hard to tell apart.`,
    )
  }
  if (cfg.enforceCVD) {
    cvd
      .filter((s) => s.minDeltaE < cvdFloor)
      .forEach((s) => {
        failures.push(
          `${s.type}: colours ${s.worstPair[0] + 1} and ${s.worstPair[1] + 1} collapse (ΔE ${s.minDeltaE.toFixed(3)}).`,
        )
      })
  }

  return {
    passesDeltaE,
    cvdSafe,
    minDeltaE,
    cvd,
    minContrast,
    failures,
  }
}

/* ------------------------------------------------------------------ */
/*  EDS categorical ramps: requirements and chart goals                */
/* ------------------------------------------------------------------ */

/**
 * What the categorical ramps have to meet (#5938). Components put text on
 * steps 1 and 2 (rest and hover) with a step 4 or 5 border; charts draw with
 * steps 3 and 4 on `background.surface`.
 */
export const DATAVIZ_RAMP_TARGETS = {
  /** Text on steps 1 and 2: WCAG 2.1 minimum */
  textRatio: 4.5,
  /** Text on steps 1 and 2: APCA target */
  textLc: 60,
  /** Step 4 border against `background.canvas` and `background.surface` */
  borderRatio: 3,
  /** Step 3 in a chart against `background.surface` */
  step3ChartRatio: 3,
  step3ChartLc: 30,
  /**
   * Step 4 in a chart against `background.surface`. Only the APCA goal: its
   * 3:1 on the surface is already the border requirement above.
   */
  step4ChartLc: 45,
} as const

/** The number of series the colour-blindness score covers (cat.1 to cat.5). */
export const DATAVIZ_SCORED_SERIES = 5

export type ContrastPair = {
  /** WCAG 2.1 ratio, unrounded */
  ratio: number
  /** APCA Lc as an absolute value, unrounded */
  lc: number
}

export type TextCandidate = {
  /** Semantic token, e.g. `text.primary` */
  token: string
  hex: string
}

export type DatavizCategoryCheck = {
  /** The text colour that suits steps 1 and 2 best */
  text: TextCandidate
  /** That text on step 1 and on step 2 */
  textOnStep1: ContrastPair
  textOnStep2: ContrastPair
  /** Step 4 against `background.canvas` and `background.surface` (ratio) */
  step4OnCanvas: number
  step4OnSurface: number
  /** Steps 3 and 4 as chart colours against `background.surface` */
  step3Chart: ContrastPair
  step4Chart: ContrastPair
}

function pair(foreground: string, background: string): ContrastPair {
  return {
    ratio: contrastValue({
      foreground,
      background,
      algorithm: 'WCAG21',
      silent: true,
    }),
    lc: contrastValue({
      foreground,
      background,
      algorithm: 'APCA',
      silent: true,
    }),
  }
}

/**
 * Check one category's five steps against the requirements. Of the text
 * candidates (`text.primary` and `text.inverted`), the one with the higher
 * lower ratio across steps 1 and 2 is used, because rest and hover share
 * the same text colour.
 */
export function checkDatavizCategory(
  steps: string[],
  backgrounds: { canvas: string; surface: string },
  textCandidates: TextCandidate[],
): DatavizCategoryCheck {
  const [step1, step2, step3, step4] = steps
  const scored = textCandidates.map((text) => {
    const onStep1 = pair(text.hex, step1)
    const onStep2 = pair(text.hex, step2)
    return {
      text,
      onStep1,
      onStep2,
      worst: Math.min(onStep1.ratio, onStep2.ratio),
    }
  })
  const best = scored.reduce((a, b) => (b.worst > a.worst ? b : a))
  return {
    text: best.text,
    textOnStep1: best.onStep1,
    textOnStep2: best.onStep2,
    step4OnCanvas: pair(step4, backgrounds.canvas).ratio,
    step4OnSurface: pair(step4, backgrounds.surface).ratio,
    step3Chart: pair(step3, backgrounds.surface),
    step4Chart: pair(step4, backgrounds.surface),
  }
}

/**
 * The colour-blindness score of the first five series at one step. `step` is
 * 1 to 5; the ramps are per category, steps 1 to 5.
 */
export function scoreDatavizSeries(
  ramps: string[][],
  step: number,
): CVDScore[] {
  return scoreCVDSafety(
    ramps.slice(0, DATAVIZ_SCORED_SERIES).map((steps) => steps[step - 1]),
  )
}
