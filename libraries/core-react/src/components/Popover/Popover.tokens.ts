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
    comfortable: {
      x_large: spacingXlarge,
      medium: spacingMedium,
      small: spacingSmall,
      x_small: spacingXsmall,
    },
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
  closeButton: {
    width: string
    height: string
    placement: string
  }
  spacings: Spacing
  borderRadius: string
  popoverTitle: {
    marginTop: string
  }
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
    width: '6px',
    height: spacingSmall,
    placement: '-5px', // 1px less than arrow width, if not the shadow would show between arrow and popover
  },
  closeButton: {
    width: spacingXlarge,
    height: spacingXlarge,
    placement: spacingSmall,
  },
  spacings: {
    top: spacingMedium,
    left: spacingMedium,
    right: spacingMedium,
    bottom: spacingMedium,
  },
  borderRadius,
  popoverTitle: {
    marginTop: spacingXsmall, // negative
  },
}
