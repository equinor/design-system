import { PALETTE_STEPS } from './config'
import { PaletteConfig } from './types'

export const paletteConfig: PaletteConfig = {
  meanLight: 0.6,
  stdDevLight: 2,
  meanDark: 0.7,
  stdDevDark: 2,
  colors: [
    { name: 'Moss Green', value: 'oklch(0.4973 0.084851 204.553)' },
    { name: 'Gray', value: 'oklch(0.4091 0 0)' },
    { name: 'North sea', value: 'oklch(0.3274 0.0363 242.96)' },
    { name: 'Green', value: 'oklch(0.6291 0.1659 142.98)' },
    { name: 'Blue', value: 'oklch(0.5857 0.135751 240.6802)' },
    { name: 'Orange', value: 'oklch(0.6934 0.164689 58.7381)' },
    { name: 'Red', value: 'oklch(0.5776 0.2314 21.12)' },
  ],
  steps: PALETTE_STEPS,
}
