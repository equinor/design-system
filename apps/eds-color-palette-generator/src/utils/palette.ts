import Color from 'colorjs.io'
import { contrast } from '@/utils/color'
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
  apca: string
  /** The unrounded WCAG 2.1 ratio, which the AA and AAA checks use */
  wcagRatio: number
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
  // WCAG thresholds apply to the unrounded ratio: 4.48:1 shows as 4.5 but
  // does not pass AA
  const wcagRatio = unroundedWcagRatio(fg, bg)
  return { wcag, apca, wcagRatio, aa: wcagRatio >= 4.5, aaa: wcagRatio >= 7 }
}

function unroundedWcagRatio(fg: string, bg: string): number {
  try {
    return new Color(bg).contrast(new Color(fg), 'WCAG21')
  } catch {
    return 0
  }
}

/* ------------------------------------------------------------------ */
/*  Simulation palettes — localStorage bridge for palette ↔ example    */
/* ------------------------------------------------------------------ */

const SIMULATION_PALETTES_KEY = 'colorPalette_simulationPalettes'

export function getSimulationPalettes(): TokenPalette[] {
  if (typeof window === 'undefined') return []
  try {
    const item = localStorage.getItem(SIMULATION_PALETTES_KEY)
    const parsed: unknown = item ? JSON.parse(item) : []
    // Anything but a list (null, an object from an older version) would
    // crash the pages that map over the palettes
    return Array.isArray(parsed) ? parsed : []
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
