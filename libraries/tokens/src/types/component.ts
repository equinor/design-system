import { Spacing, Borders, Typography, Outline, Clickbound } from './index'

export type ComponentToken = {
  height?: string
  background: string
  spacings: Spacing
  border: Borders
  typography: Typography
  outline?: Outline
  clickbound?: Clickbound
  states?: {
    active?: ComponentState
    disabled?: ComponentState
    focus?: ComponentState
    hover?: ComponentState
  }
}

type ComponentState = Partial<Omit<ComponentToken, 'states'>>
