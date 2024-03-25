import { tokens } from '@equinor/eds-tokens'
import type { Borders, ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: background },
      background__light: { rgba: borderColor },
    },
  },
  spacings: {
    comfortable: { xx_small: spacingXXS, medium: spacingMedium },
  },
  typography: {
    paragraph: { body_short },
  },
} = tokens

type SidesheetToken = ComponentToken & {
  borderRight?: Borders
  borderLeft?: Borders
}

export const comfortable: SidesheetToken = {
  background,
  spacings: {
    left: '14px', // padding left is 14px, because of border-left 'steals' 2px of the padding
    right: spacingMedium,
    top: spacingMedium,
  },
  typography: { ...body_short },
  borderLeft: {
    type: 'bordergroup',
    left: { color: borderColor, width: spacingXXS, style: 'solid' },
  },
  borderRight: {
    type: 'bordergroup',
    right: { color: borderColor, width: spacingXXS, style: 'solid' },
  },
}

export const variants = {
  small: '240px',
  medium: '320px',
  large: '480px',
  xlarge: '640px',
}
