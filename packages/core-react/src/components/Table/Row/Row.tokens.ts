import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      table__cell__fill_hover: { rgba: hoverBackgroundColor },
      table__cell__fill_activated: { rgba: activeBackgroundColor },
    },
  },
} = tokens

export const token: ComponentToken = {
  states: {
    active: {
      background: activeBackgroundColor,
    },
    hover: {
      background: hoverBackgroundColor,
    },
  },
}
