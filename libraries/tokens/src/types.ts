import { typography } from '../base/typography'
import { elevation } from '../base/elevation'

export type Typography = {
  color: string
  fontFamily: string
  fontSize: string
  fontWeight: number | string
  lineHeight: string
  textAlign: string
  letterSpacing?: string
  fontStyle?: string
  textTransform?: string
  textDecoration?: string
  fontFeature?: string
}

export type TypographyTokens = {
  [P1 in keyof typeof typography]: {
    [P2 in keyof typeof typography[P1]]: Typography
  }
}

export type Spacing = {
  left: string
  right: string
  top?: string
  bottom?: string
}

export type SpacingTokens = {
  comfortable: {
    xxx_large: string
    xx_large: string
    x_large: string
    large: string
    medium: string
    medium_small: string
    small: string
    x_small: string
    xx_small: string
  }
}

export type Elevations = {
  [P in keyof typeof elevation]: string
}

export type Color = {
  hex: string
  hsla: string
  rgba: string
}

export type Focus = {
  type?: 'dashed' | string
  color: string
  width: string
  gap?: string
}

export type Hover = {
  background: string
  radius?: string
}

export type Pressed = {
  color: string
}

export type Clickbounds = {
  jumbo__base: string
  default__base: string
  default__input: string
}

export type Clickbound = {
  height: string
  width: string
  offset:
    | {
        x: string
        y: string
      }
    | number
}

export type Border = {
  type?: 'border'
  radius?: string | number
  color?: string
  width?: string | number
  style?: 'solid'
}

export type Outline = {
  type: 'outline'
  color: string
  width: string
  style: 'dashed'
}

export type Bordergroup = {
  type?: 'bordergroup'
  top?: Border
  left?: Border
  right?: Border
  bottom?: Border
}

export type Borders = Border | Outline | Bordergroup

export type Space = { comfortable: string; compact: string }
