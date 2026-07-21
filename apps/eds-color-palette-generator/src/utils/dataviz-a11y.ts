import { contrast, deltaE } from './color'
import { simulateCVD, CVD_DICHROMACIES } from './cvd'
import type { CategoricalConfig, SwatchColor } from '@/config/dataviz-types'

/**
 * Fraction of the normal-vision ΔE floor that must survive under each
 * dichromacy. CVD always compresses separation, so we allow some loss: a
 * well-formed small palette stays comfortably above this, while over-crowded
 * palettes fall below it and are reported as unsafe.
 */
const CVD_TOLERANCE = 0.6

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
