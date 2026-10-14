export type ColorValue = string

export type ColorAnchor = {
  value: string // color value (any format)
  step: number // which step (1-15) this anchors to
}

export type ColorDefinition =
  | { name: string; value: string }
  | { name: string; anchors: ColorAnchor[] }

export type ColorFormat = 'HEX' | 'OKLCH'
