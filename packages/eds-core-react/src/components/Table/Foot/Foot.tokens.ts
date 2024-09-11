import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__medium: { rgba: borderColor },
    },
    interactive: {
      table__header__fill_resting: { rgba: backgroundColor },
    },
  },
} = tokens

export const token: ComponentToken = {
  background: backgroundColor,
  border: {
    type: 'bordergroup',
    bottom: {
      type: 'border',
      width: '2px',
      color: borderColor,
      style: 'solid',
    },
  },
}
