import { STEP_COUNT, hueKey, type Scheme } from '@/config/tokensStudio'
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
 * Whether a step is a colour the pages can use: a six-digit hex value, the
 * format the Palette editor works in. While typing, a step can hold `#12`.
 */
export function isHexColour(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
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

/**
 * The palettes saved by the Palette editor, or `null` when nothing usable is
 * saved. An empty list is a saved choice (every palette removed), so the
 * editor can tell it from a first visit.
 */
export function getSimulationPalettes(): TokenPalette[] | null {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(SIMULATION_PALETTES_KEY)
    if (item === null) return null
    const parsed: unknown = JSON.parse(item)
    // Anything but a list of palettes (null, an object from an older
    // version, a palette without 15 steps) would crash the pages that map
    // over the palettes, and it stays stored across reloads
    return Array.isArray(parsed) ? parsed.filter(isTokenPalette) : null
  } catch {
    return null
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

/** The Tokens Studio hue a palette is named after, in light mode. */
function lightHueFor(palette: TokenPalette): TokenPalette | undefined {
  const key = hueKey(palette.name)
  return tokensStudioPalettes('light').find((hue) => hueKey(hue.name) === key)
}

/** Whether a saved palette is a Tokens Studio hue that was not edited. */
function isUnchangedHue(palette: TokenPalette): boolean {
  const hue = lightHueFor(palette)
  return (
    hue !== undefined &&
    hue.steps.every(
      (step, i) => step.toLowerCase() === palette.steps[i].toLowerCase(),
    )
  )
}

/** What dark mode adds to the name of a saved palette in `examplePalettes`. */
const LIGHT_RAMP_SUFFIX = ' (light)'

/**
 * The palettes the Examples page shows for a scheme: the seven Tokens Studio
 * hues together with the palettes saved in the Palette editor.
 *
 * The editor saves what it shows, so a step can be half typed (`#12`); a
 * palette with such a step is left out until the step is a colour again.
 *
 * The editor saves its whole list, unedited hues included, and its ramps are
 * light ramps, since it starts from `editablePalettesFromTokensStudio()`. In
 * light mode a saved palette named after a hue takes that hue's place, as in
 * `toneRamps`, so each hue is listed once, and the other saved palettes
 * follow the hues. In dark mode a light ramp must not stand in for a dark
 * hue: the dark hues stay, unedited copies are left out, and the edited and
 * new palettes follow with "(light)" after the name.
 */
export function examplePalettes(
  scheme: Scheme,
  saved: TokenPalette[],
): TokenPalette[] {
  const hues = tokensStudioPalettes(scheme)
  const usable = saved.filter((palette) => palette.steps.every(isHexColour))
  if (scheme === 'dark') {
    const lightRamps = usable
      .filter((palette) => !isUnchangedHue(palette))
      .map((palette) => ({
        ...palette,
        name: `${palette.name}${LIGHT_RAMP_SUFFIX}`,
      }))
    return [...hues, ...lightRamps]
  }
  const rest = [...usable]
  const merged = hues.map((hue) => {
    const key = hueKey(hue.name)
    const index = rest.findIndex((palette) => hueKey(palette.name) === key)
    return index === -1 ? hue : rest.splice(index, 1)[0]
  })
  return [...merged, ...rest]
}

/**
 * A picked palette in `examplePalettes`, kept across a scheme switch. The
 * index cannot be kept, because the light and dark lists differ in length
 * and order, and the name alone is not enough, because saved palettes can
 * share a name. So the pick is the name without " (light)" and which of the
 * palettes with that name it is.
 */
export type PalettePick = { name: string; nth: number }

function pickName(palette: TokenPalette): string {
  return palette.name.endsWith(LIGHT_RAMP_SUFFIX)
    ? palette.name.slice(0, -LIGHT_RAMP_SUFFIX.length)
    : palette.name
}

/** The pick for the palette at `index`. */
export function pickAt(palettes: TokenPalette[], index: number): PalettePick {
  const name = pickName(palettes[index])
  const nth = palettes
    .slice(0, index)
    .filter((palette) => pickName(palette) === name).length
  return { name, nth }
}

/**
 * Where the pick is in `palettes`. When there are fewer palettes with the
 * name, the first of them is used; when the name is gone (a saved palette
 * was removed), the first palette.
 */
export function pickIndex(palettes: TokenPalette[], pick: PalettePick): number {
  const matches = palettes.flatMap((palette, i) =>
    pickName(palette) === pick.name ? [i] : [],
  )
  return matches[pick.nth] ?? matches[0] ?? 0
}
