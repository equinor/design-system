export type ColorValue = string

export type ColorDefinition = {
  name: string
  hex: string
}

export type ConfigFile = {
  lightModeValues: number[]
  darkModeValues: number[]
  meanLight: number
  stdDevLight: number
  meanDark: number
  stdDevDark: number
  colors?: ColorDefinition[]
}

export type ContrastMethod = 'WCAG21' | 'APCA'

export type ColorFormat = 'HEX' | 'OKLCH'
