import {
  Spacing,
  Borders,
  Typography,
  Outline,
  Clickbound,
  Pressed,
} from './index'

export type ComponentToken = {
  height?: string
  background: string
  spacings: Spacing
  border: Borders
  typography: Typography
  clickbound?: Clickbound
  states?: {
    active?: ComponentState
    disabled?: ComponentState
    focus?: ComponentState & { outline?: Outline }
    hover?: ComponentState
    pressed?: ComponentState & { pressed?: Pressed }
  }
}

type ComponentState = Partial<Omit<ComponentToken, 'states'>>
