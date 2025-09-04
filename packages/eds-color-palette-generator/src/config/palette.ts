import { PALETTE_STEPS } from './config'
import { PaletteConfig } from './types'

export const paletteConfig: PaletteConfig = {
  meanLight: 0.6,
  stdDevLight: 2,
  meanDark: 0.7,
  stdDevDark: 2,
  colors: [
    { name: 'Moss Green', hex: '#007079' },
    { name: 'Gray', hex: '#4A4A4A' },
    { name: 'Green', hex: '#3FA13D' },
    { name: 'Blue', hex: '#0084C4' },
    { name: 'Orange', hex: '#E57E00' },
    { name: 'Red', hex: '#E20337' },
  ],
  steps: PALETTE_STEPS,
}
