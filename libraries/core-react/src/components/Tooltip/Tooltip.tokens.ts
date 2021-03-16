import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing } from '@equinor/eds-tokens'

const {
  colors: {
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

export type Tooltip = {
  typography: Typography
  background: string
  tooltip: {
    minHeight: string
  }
  arrow: {
    width: string
    height: string
    placement: string
  }
  spacings: Spacing
  borderRadius: string
}

export const tooltip: Tooltip = {
  typography: {
    ...ui.tooltip,
    color: '#fff',
  },
  background,
  tooltip: {
    minHeight: spacingXlarge,
  },
  arrow: {
    width: '6px',
    height: spacingSmall,
    placement: '-6px',
  },
  spacings: {
    left: spacingSmall,
    right: spacingSmall,
    top: spacingSmall,
    bottom: spacingSmall,
  },
  borderRadius,
}
