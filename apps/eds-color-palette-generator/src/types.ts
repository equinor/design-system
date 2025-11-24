export type ColorValue = string

export type ColorAnchor = {
  value: string // color value (any format)
  step: number // which step (1-15) this anchors to
}

export type ColorDefinition = {
  name: string
  // Support both legacy single value and new anchor array
  value?: string // legacy single color
  anchors?: ColorAnchor[] // new multi-color with steps
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
