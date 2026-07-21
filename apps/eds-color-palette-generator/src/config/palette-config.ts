import { PALETTE_STEPS } from './config'
import { PaletteConfig } from './types'

export const paletteConfig: PaletteConfig = {
  meanLight: 0.6,
  stdDevLight: 2,
  meanDark: 0.7,
  stdDevDark: 2,
  colors: [
    // Accent — the fixed Equinor brand colour. Always #206F77. Kept as a single
    // colour (not anchors) so the accent/default (step 9) is pinned in light and
    // inverts to a light tint in dark (Model 1 / accessible), not pinned dark.
    { name: 'Moss Green', value: '#206F77' },
    // Neutral — the fixed Gray ramp (achromatic). Base is #696969 so the step-9
    // pin lands on Figma's Gray/9 value; every other step is achromatic and
    // unaffected by the base, so the ramp matches the Figma Light/Gray primitive.
    { name: 'Gray', value: '#696969' },
    {
      name: 'North sea',
      anchors: [
        { value: 'oklch(0.413 0.0774 252.47)', step: 6 },
        { value: 'oklch(0.3274 0.0363 242.96)', step: 9 },
      ],
    },
    { name: 'Green', value: 'oklch(0.6291 0.1659 142.98)' },
    { name: 'Blue', value: 'oklch(0.5857 0.135751 240.6802)' },
    { name: 'Orange', value: 'oklch(0.6934 0.164689 58.7381)' },
    { name: 'Red', value: 'oklch(0.5776 0.2314 21.12)' },
  ],
  steps: PALETTE_STEPS,
}
