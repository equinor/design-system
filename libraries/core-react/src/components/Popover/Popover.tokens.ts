import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing } from '@equinor/eds-tokens'

const {
  typography: {
    ui: { accordion_header: header },
  },
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium, large: spacingLarge },
  },
  shape: {
    corners: { borderRadius },
  },
  elevation: { overlay: elevation },
} = tokens

type Popover = {
  header: Typography
  background: string
  elevation: string
  gridGap: string
  popover: {
    minHeight: string
    maxWidth: string
    maxHeight: string
  }
  arrow: {
    width: string
    height: string
    placement: string
  }
  spacings: Spacing
  borderRadius: string
}

export const popover: Popover = {
  header,
  background,
  elevation,
  gridGap: spacingMedium,
  popover: {
    minHeight: '48px',
    maxWidth: '560px',
    maxHeight: '80vh',
  },
  arrow: {
    width: '8px',
    height: '8px',
    placement: '4px',
  },
  spacings: {
    top: spacingMedium,
    left: spacingMedium,
    right: spacingMedium,
    bottom: spacingMedium,
  },
  borderRadius,
}
