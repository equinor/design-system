import { PALETTE_STEPS } from './config'
import { PaletteConfig } from './types'

export const paletteConfig: PaletteConfig = {
  meanLight: 0.6,
  stdDevLight: 2,
  meanDark: 0.7,
  stdDevDark: 2,
  colors: [
    { name: 'Moss Green', value: '#007079' },
    { name: 'Gray', value: '#4A4A4A' },
    { name: 'North sea', value: '#243746' },
    { name: 'Green', value: '#3FA13D' },
    { name: 'Blue', value: '#0084C4' },
    { name: 'Orange', value: '#E57E00' },
    { name: 'Red', value: '#E20337' },
  ],
  steps: PALETTE_STEPS,
}
