import { contrast } from '@/utils/color'

/* ------------------------------------------------------------------ */
/*  EDS token palettes — Primitive values from Figma                   */
/* ------------------------------------------------------------------ */

/**
 * Primitive step labels (1-indexed in Figma, 0-indexed here).
 *
 * Named after primary Figma semantic usage — a single step can serve
 * multiple roles depending on context (palette, mode, component).
 */
export const STEP_ROLES = [
  '1 · bg/canvas',
  '2 · bg/surface',
  '3 · bg/surface-hover',
  '4 · bg/surface-pressed',
  '5 · bg/interactive',
  '6 · bg/interactive-hover',
  '7 · border/subtle',
  '8 · border/default',
  '9 · fill/emphasis',
  '10 · fill/emphasis-hover',
  '11 · fill/emphasis-pressed',
  '12 · fg/strong',
  '13 · fg/stronger',
  '14 · fg/on-emphasis',
  '15 · bg/card, sheet, popover',
] as const

export type StepRole = (typeof STEP_ROLES)[number]

export type TokenPalette = {
  name: string
  steps: string[]
}

export const PALETTES: TokenPalette[] = [
  {
    name: 'Moss Green',
    steps: [
      '#ffffff', '#f8ffff', '#f4feff', '#f0fbfc', '#daecee',
      '#cde3e5', '#bedade', '#bedade', '#84b9bf', '#30747c',
      '#2d6e75', '#2b6167', '#2a5b61', '#28555a', '#254346',
    ],
  },
  {
    name: 'Gray',
    steps: [
      '#f5f5f5', '#ebebeb', '#e1e1e1', '#d4d4d4', '#c4c4c4',
      '#b4b4b4', '#a4a4a4', '#868686', '#696969', '#5b5b5b',
      '#4d4d4d', '#404040', '#333333', '#dedede', '#ffffff',
    ],
  },
]

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
  wcag: string
  apca: string
  aa: boolean
  aaa: boolean
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function calcContrast(fg: string, bg: string): ContrastResult {
  const wcag = String(
    contrast({ foreground: fg, background: bg, algorithm: 'WCAG21', silent: true }),
  )
  const apca = String(
    contrast({ foreground: fg, background: bg, algorithm: 'APCA', silent: true }),
  )
  const wn = parseFloat(wcag)
  return { wcag, apca, aa: wn >= 4.5, aaa: wn >= 7 }
}

export function roleIndex(role: StepRole): number {
  return STEP_ROLES.indexOf(role)
}

/* ------------------------------------------------------------------ */
/*  Simulation palettes — localStorage bridge for palette ↔ example    */
/* ------------------------------------------------------------------ */

const SIMULATION_PALETTES_KEY = 'colorPalette_simulationPalettes'

export function getSimulationPalettes(): TokenPalette[] {
  if (typeof window === 'undefined') return []
  try {
    const item = localStorage.getItem(SIMULATION_PALETTES_KEY)
    return item ? JSON.parse(item) : []
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
