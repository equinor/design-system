/**
 * Resolves Tokens Studio semantic colour tokens against generated ramps.
 *
 * The chain mirrors Tokens Studio (ADR 0016 D2, D7): a semantic token points
 * at a tone and step (`text.primary` → `neutral.13`), the scheme maps the tone
 * to a hue (`neutral` → gray in light, north-sea in dark), and the hue's ramp
 * gives the colour. The previews use this so they show the user's palettes
 * through the same mapping the design system uses.
 */
import { generateColorScale } from '@/utils/color'
import {
  TONES,
  TS_DATAVIZ,
  TS_GAUSSIAN,
  TS_HUES,
  TS_SCALE,
  TS_SEMANTIC,
  TS_TONE_HUE,
  getSemanticToken,
  hueDisplayName,
  hueKey,
  type Scheme,
  type Tone,
} from '@/config/tokensStudio'

/** 15 colours, step 1 first. */
export type Ramp = string[]

export type NamedRamp = { name: string; steps: Ramp }

export type ToneRamps = Record<Tone, Ramp>

/** Semantic token path → colour. */
export type SemanticColors = Record<string, string>

const paletteCache = new Map<Scheme, NamedRamp[]>()

/** The seven Tokens Studio hues generated for a scheme, as hex ramps. */
export function tokensStudioPalettes(scheme: Scheme): NamedRamp[] {
  const cached = paletteCache.get(scheme)
  if (cached) return cached
  const palettes = TS_HUES.map((hue) => ({
    name: hue.name,
    steps: generateColorScale(
      hue.anchor,
      TS_SCALE[scheme],
      TS_GAUSSIAN[scheme].mean,
      TS_GAUSSIAN[scheme].stdDev,
      'HEX',
    ),
  }))
  paletteCache.set(scheme, palettes)
  return palettes
}

/** The palette that plays a tone's hue, looked up by name. */
export function findPaletteForTone<T extends { name: string }>(
  palettes: T[],
  tone: Tone,
  scheme: Scheme,
): T | undefined {
  const hue = TS_TONE_HUE[scheme][tone]
  return palettes.find((palette) => hueKey(palette.name) === hue)
}

/**
 * The palette that plays a tone: the one whose name matches the tone's
 * Tokens Studio hue, or else the Tokens Studio default for that hue. Returns
 * the caller's own object when it matches, so callers can tell it apart from
 * the other palettes by identity.
 */
export function paletteForTone<T extends NamedRamp>(
  palettes: T[],
  tone: Tone,
  scheme: Scheme,
): T | NamedRamp {
  return (
    findPaletteForTone(palettes, tone, scheme) ??
    findPaletteForTone(tokensStudioPalettes(scheme), tone, scheme) ?? {
      name: hueDisplayName(TS_TONE_HUE[scheme][tone]),
      steps: [],
    }
  )
}

/**
 * Tone → ramp for a scheme. Each tone uses its Tokens Studio hue. A palette
 * whose name matches that hue (an edited "Moss Green" in the Theme Builder,
 * say) replaces the Tokens Studio default, and `overrides` assigns a ramp to
 * a tone explicitly.
 */
export function toneRamps(
  scheme: Scheme,
  palettes: NamedRamp[] = [],
  overrides: Partial<Record<Tone, Ramp>> = {},
): ToneRamps {
  const defaults = tokensStudioPalettes(scheme)
  return Object.fromEntries(
    TONES.map((tone) => {
      const ramp =
        overrides[tone] ??
        findPaletteForTone(palettes, tone, scheme)?.steps ??
        findPaletteForTone(defaults, tone, scheme)?.steps ??
        []
      return [tone, ramp]
    }),
  ) as ToneRamps
}

/** Resolve one semantic token to a colour, or undefined if it is unknown. */
export function resolveToken(
  path: string,
  ramps: ToneRamps,
  scheme: Scheme,
): string | undefined {
  const token = getSemanticToken(path)
  if (!token) return undefined
  switch (token.ref.kind) {
    case 'step':
      return ramps[token.ref.tone][token.ref.step - 1]
    case 'dataviz':
      return TS_DATAVIZ[scheme][token.ref.path]
    case 'literal':
      return token.ref.value
  }
}

/** Resolve every semantic colour token for a scheme. */
export function resolveSemanticColors(
  ramps: ToneRamps,
  scheme: Scheme,
): SemanticColors {
  const colors: SemanticColors = {}
  for (const token of TS_SEMANTIC) {
    const value = resolveToken(token.path, ramps, scheme)
    if (value) colors[token.path] = value
  }
  return colors
}

/** The step a semantic token points at (`text.primary` → 13), if any. */
export function tokenStep(path: string): number | undefined {
  const token = getSemanticToken(path)
  return token?.ref.kind === 'step' ? token.ref.step : undefined
}

/** The tone a semantic token points at (`text.primary` → `neutral`), if any. */
export function tokenTone(path: string): Tone | undefined {
  const token = getSemanticToken(path)
  return token?.ref.kind === 'step' ? token.ref.tone : undefined
}

/** `text.primary` → `neutral.13`, for labels. */
export function tokenTarget(path: string): string {
  const token = getSemanticToken(path)
  if (!token) return ''
  switch (token.ref.kind) {
    case 'step':
      return `${token.ref.tone}.${token.ref.step}`
    case 'dataviz':
      return token.ref.path
    case 'literal':
      return token.ref.value
  }
}
