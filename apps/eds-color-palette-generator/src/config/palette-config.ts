import { PALETTE_STEPS } from './config'
import { TS_GAUSSIAN, TS_HUES } from './tokensStudio'
import { PaletteConfig } from './types'

/**
 * Default palettes: the seven Tokens Studio hue anchors (`input/palette`),
 * accent and neutral first, with the Tokens Studio gaussian parameters.
 */
export const paletteConfig: PaletteConfig = {
  meanLight: TS_GAUSSIAN.light.mean,
  stdDevLight: TS_GAUSSIAN.light.stdDev,
  meanDark: TS_GAUSSIAN.dark.mean,
  stdDevDark: TS_GAUSSIAN.dark.stdDev,
  colors: TS_HUES.map((hue) => ({ name: hue.name, value: hue.anchor })),
  steps: PALETTE_STEPS,
}
