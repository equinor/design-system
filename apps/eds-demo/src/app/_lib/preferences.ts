export const colorSchemes = ['light', 'dark'] as const
export const densities = ['compact', 'comfortable', 'relaxed'] as const

export type ColorScheme = (typeof colorSchemes)[number]
export type Density = (typeof densities)[number]

export const COLOR_SCHEME_COOKIE = 'eds-demo-color-scheme'
export const DENSITY_COOKIE = 'eds-demo-density'

export function toColorScheme(value: string | undefined): ColorScheme {
  return colorSchemes.find((scheme) => scheme === value) ?? 'light'
}

export function toDensity(value: string | undefined): Density {
  return densities.find((density) => density === value) ?? 'comfortable'
}
