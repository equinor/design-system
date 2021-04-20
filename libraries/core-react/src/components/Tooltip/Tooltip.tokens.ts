import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    text: {
      static_icons__primary_white: { rgba: white },
    },
    ui: {
      background__overlay: { rgba: background },
    },
  },
  typography: { ui },
  spacings: {
    comfortable: { x_large: spacingXlarge, small: spacingSmall },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

type TooltipToken = ComponentToken

export const tooltip: TooltipToken = {
  typography: {
    ...ui.tooltip,
    color: white,
  },
  background,
  border: {
    type: 'border',
    radius: borderRadius,
  },
  entities: {
    tooltip: {
      height: spacingXlarge,
    },
    arrow: {
      width: '6px',
      height: spacingSmall,
      spacings: {
        bottom: '-6px',
        top: '-6px',
        left: '-6px',
        right: '-6px',
      },
    },
  },
  spacings: {
    left: spacingSmall,
    right: spacingSmall,
    top: spacingSmall,
    bottom: spacingSmall,
  },
}
