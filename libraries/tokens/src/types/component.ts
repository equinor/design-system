import {
  Spacing,
  Borders,
  Typography,
  Outline,
  Clickbound,
  Pressed,
} from './index'

type Size = {
  min?: string
  max?: string
}

export type ComponentToken = {
  height?: string | Size
  width?: string | Size
  background?: string
  spacings?: Spacing
  border?: Borders
  typography?: Partial<Typography>
  clickbound?: Clickbound
  states?: {
    active?: ComponentState
    disabled?: ComponentState
    focus?: ComponentState & { outline?: Outline }
    hover?: ComponentState
    pressed?: ComponentState & { pressed?: Pressed }
  }
  entities?: Record<string, ComponentToken>
  modes?: {
    compact?: ComponentToken
  }
}

type ComponentState = Partial<Omit<ComponentToken, 'states'>>
