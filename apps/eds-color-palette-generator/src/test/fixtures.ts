/**
 * Test data derived from Tokens Studio, so a Tokens Studio pull never breaks
 * a test with a stale colour. Not a test file itself.
 */
import { TS_GAUSSIAN, TS_HUES, TS_SCALE } from '@/config/tokensStudio'
import type { Scheme } from '@/config/tokensStudio'
import { generateColorScale } from '@/utils/color'
import type { PaletteInput } from '@/utils/urlState'

/** The Theme Builder's default palettes: the Tokens Studio anchors. */
export function tokensStudioInputs(): PaletteInput[] {
  return TS_HUES.map((hue) => ({ name: hue.name, baseColor: hue.anchor }))
}

/** The Tokens Studio hues generated as the Theme Builder does it. */
export function generatedPalettes(scheme: Scheme = 'light') {
  const { mean, stdDev } = TS_GAUSSIAN[scheme]
  return TS_HUES.map((hue) => {
    const scale = (format: 'HEX' | 'OKLCH') =>
      generateColorScale(hue.anchor, TS_SCALE[scheme], mean, stdDev, format)
    return { name: hue.name, steps: scale('HEX'), oklch: scale('OKLCH') }
  })
}
