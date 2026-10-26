import { STEP_COUNT } from '@/config/tokensStudio'
import { contrast, contrastValue } from '@/utils/color'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

/* ------------------------------------------------------------------ */
/*  Palettes                                                           */
/* ------------------------------------------------------------------ */

/**
 * A named 15-step ramp, step 1 first. The default ramps come from
 * `tokensStudioPalettes(scheme)` in `@/utils/semanticTokens`; step names
 * and roles come from `PALETTE_STEPS` in `@/config/config`.
 */
export type TokenPalette = {
  name: string
  steps: string[]
}

/**
 * The seven Tokens Studio hues in light mode as editable palettes, the
 * Palette editor's starting point. Copies, so editing a step never changes
 * the cached Tokens Studio ramps.
 */
export function editablePalettesFromTokensStudio(): TokenPalette[] {
  return tokensStudioPalettes('light').map((palette) => ({
    name: palette.name,
    steps: [...palette.steps],
  }))
}

/* ------------------------------------------------------------------ */
/*  APCA font lookup table                                             */
/* ------------------------------------------------------------------ */

export const APCA_FONT_ROWS: Array<{
  size: number
  weights: Array<{ weight: number; name: string; minLc: number }>
}> = [
  {
    size: 12,
    weights: [
      { weight: 400, name: 'Regular', minLc: Infinity },
      { weight: 500, name: 'Medium', minLc: Infinity },
      { weight: 700, name: 'Bold', minLc: 100 },
    ],
  },
  {
    size: 14,
    weights: [
      { weight: 400, name: 'Regular', minLc: 90 },
      { weight: 500, name: 'Medium', minLc: 75 },
      { weight: 700, name: 'Bold', minLc: 60 },
    ],
  },
  {
    size: 16,
    weights: [
      { weight: 400, name: 'Regular', minLc: 75 },
      { weight: 500, name: 'Medium', minLc: 60 },
      { weight: 700, name: 'Bold', minLc: 45 },
    ],
  },
  {
    size: 18,
    weights: [
      { weight: 400, name: 'Regular', minLc: 60 },
      { weight: 500, name: 'Medium', minLc: 55 },
      { weight: 700, name: 'Bold', minLc: 45 },
    ],
  },
  {
    size: 24,
    weights: [
      { weight: 400, name: 'Regular', minLc: 45 },
      { weight: 500, name: 'Medium', minLc: 40 },
      { weight: 700, name: 'Bold', minLc: 30 },
    ],
  },
]

export function getApcaFontBreakdown(lc: number) {
  return APCA_FONT_ROWS.map(({ size, weights }) => {
    const passing = weights.find((w) => lc >= w.minLc)
    return {
      size,
      minWeight: passing?.weight ?? null,
      minWeightName: passing?.name ?? null,
    }
  })
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ContrastResult = {
  /** The WCAG 2.1 ratio rounded to one decimal, for display */
  wcag: string
  /** The APCA Lc as a whole number, for display */
  apca: string
  /** The unrounded WCAG 2.1 ratio, which the AA and AAA checks use */
  wcagRatio: number
  /** The unrounded APCA Lc as an absolute value, which APCA checks use */
  apcaLc: number
  aa: boolean
  aaa: boolean
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function calcContrast(fg: string, bg: string): ContrastResult {
  const wcag = String(
    contrast({
      foreground: fg,
      background: bg,
      algorithm: 'WCAG21',
      silent: true,
    }),
  )
  const apca = String(
    contrast({
      foreground: fg,
      background: bg,
      algorithm: 'APCA',
      silent: true,
    }),
  )
  // Thresholds apply to the unrounded values: 4.48:1 shows as 4.5 but does
  // not pass AA, and Lc 59.6 shows as 60 but does not reach Lc 60
  const wcagRatio = contrastValue({
    foreground: fg,
    background: bg,
    algorithm: 'WCAG21',
    silent: true,
  })
  const apcaLc = contrastValue({
    foreground: fg,
    background: bg,
    algorithm: 'APCA',
    silent: true,
  })
  return {
    wcag,
    apca,
    wcagRatio,
    apcaLc,
    aa: wcagRatio >= 4.5,
    aaa: wcagRatio >= 7,
  }
}

/* ------------------------------------------------------------------ */
/*  Simulation palettes — localStorage bridge for palette ↔ example    */
/* ------------------------------------------------------------------ */

const SIMULATION_PALETTES_KEY = 'colorPalette_simulationPalettes'

/**
 * A stored palette the pages can use: a string name and one string per step.
 * The pages read steps by index, so a palette with fewer steps would give
 * them `undefined` colours.
 */
function isTokenPalette(value: unknown): value is TokenPalette {
  if (typeof value !== 'object' || value === null) return false
  const { name, steps } = value as Record<string, unknown>
  return (
    typeof name === 'string' &&
    Array.isArray(steps) &&
    steps.length === STEP_COUNT &&
    steps.every((step) => typeof step === 'string')
  )
}

export function getSimulationPalettes(): TokenPalette[] {
  if (typeof window === 'undefined') return []
  try {
    const item = localStorage.getItem(SIMULATION_PALETTES_KEY)
    const parsed: unknown = item ? JSON.parse(item) : []
    // Anything but a list of palettes (null, an object from an older
    // version, a palette without 15 steps) would crash the pages that map
    // over the palettes, and it stays stored across reloads
    return Array.isArray(parsed) ? parsed.filter(isTokenPalette) : []
  } catch {
    return []
  }
}

export function setSimulationPalettes(palettes: TokenPalette[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SIMULATION_PALETTES_KEY, JSON.stringify(palettes))
  } catch {
    /* ignore */
  }
}

export function clearSimulationPalettes(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SIMULATION_PALETTES_KEY)
}
