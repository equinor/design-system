import type { ColorDefinition } from '@/types'
import { isValidColorFormat, parseColorToHex } from '@/utils/color'
import type { PaletteInput } from '@/utils/urlState'

/** Theme Builder palettes as the colour definitions the exports take. */
export function palettesToColors(palettes: PaletteInput[]): ColorDefinition[] {
  return palettes.map((p) =>
    p.anchors && p.anchors.length > 0
      ? { name: p.name, anchors: p.anchors }
      : {
          name: p.name,
          value: p.baseColor.startsWith('#') ? p.baseColor : `#${p.baseColor}`,
        },
  )
}

/**
 * The palettes in an uploaded config, or null if the file has none. Only
 * the palettes are read: lightness and chroma always come from Tokens Studio.
 */
export function palettesFromConfig(config: unknown): PaletteInput[] | null {
  if (typeof config !== 'object' || config === null) return null
  const colors = (config as { colors?: unknown }).colors
  if (!Array.isArray(colors) || colors.length === 0) return null

  const palettes: PaletteInput[] = []
  for (const entry of colors) {
    if (typeof entry !== 'object' || entry === null) return null
    const { name, value, anchors } = entry as {
      name?: unknown
      value?: unknown
      anchors?: unknown
    }
    if (typeof name !== 'string') return null
    if (typeof value === 'string' && isValidColorFormat(value)) {
      const hex = parseColorToHex(value)
      if (!hex) return null
      palettes.push({ name, baseColor: hex.replace('#', '') })
    } else if (Array.isArray(anchors) && anchors.length > 0) {
      const valid = anchors.every(
        (a) =>
          typeof a === 'object' &&
          a !== null &&
          typeof a.value === 'string' &&
          isValidColorFormat(a.value) &&
          typeof a.step === 'number' &&
          a.step >= 1 &&
          a.step <= 15,
      )
      if (!valid) return null
      palettes.push({ name, baseColor: '', anchors })
    } else {
      return null
    }
  }
  return palettes
}
