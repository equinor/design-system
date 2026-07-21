import { generateColorScale } from '@/utils/color'
import type { TokenPalette } from '@/utils/palette'
import { localStorageUtils } from '@/utils/localStorage'
import { paletteConfig } from '@/config/palette-config'
import { getLightnessValues } from '@/config/helpers'
import { PALETTE_STEPS } from '@/config/config'
import type { ColorDefinition } from '@/types'

/**
 * Build token palettes from the colours + Gaussian parameters the generator
 * stored in localStorage (falling back to the defaults in `paletteConfig`).
 * Client-only — reads localStorage, so call it from effects / event handlers,
 * never during render or SSR.
 */
export function generatePalettesFromGenerator(): TokenPalette[] {
  const colors = localStorageUtils.getColors(paletteConfig.colors)
  const mean = localStorageUtils.getMeanLight(paletteConfig.meanLight)
  const stdDev = localStorageUtils.getStdDevLight(paletteConfig.stdDevLight)
  const lightnessValues = localStorageUtils.getLightModeValues(
    getLightnessValues('light')(PALETTE_STEPS),
  )

  return colors.map((c: ColorDefinition) => {
    const baseColor = 'anchors' in c ? c.anchors : c.value
    const steps = generateColorScale(baseColor, lightnessValues, mean, stdDev, 'HEX')
    return { name: c.name, steps }
  })
}
