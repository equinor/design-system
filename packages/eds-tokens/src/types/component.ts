import {
  Spacing,
  Borders,
  Typography,
  Outline,
  Clickbound,
  Pressed,
  Align,
} from './index'

export type ComponentToken = {
  maxHeight?: string
  minHeight?: string
  height?: string
  maxWidth?: string
  minWidth?: string
  width?: string
  boxShadow?: string
  background?: string
  align?: Align
  spacings?: Spacing
  border?: Borders
  typography?: Partial<Typography>
  clickbound?: Clickbound
  outline?: Outline
  states?: {
    active?: ComponentToken
    disabled?: ComponentToken
    readOnly?: ComponentToken
    focus?: ComponentToken
    hover?: ComponentToken
    pressed?: ComponentToken & { pressed?: Pressed }
  }
  entities?: Record<string, ComponentToken>
  modes?: {
    compact?: ComponentToken
  }
}
