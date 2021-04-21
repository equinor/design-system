import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

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

type Popover = ComponentToken & {
  elevation: string
  popover: {
    // TODO: Remove these when min/max values are added to ComponentToken
    minHeight: string
    maxWidth: string
    maxHeight: string
  }
}

export const popover: Popover = {
  background,
  elevation,
  typography: header,
  popover: {
    // TODO: Add to entites when min/max values are added to ComponentToken
    minHeight: '48px',
    maxWidth: '560px',
    maxHeight: '80vh',
  },
  entities: {
    arrow: {
      width: '6px',
      height: spacingSmall,
      spacings: {
        top: '-5px', // 1px less than arrow width, if not the shadow would show between arrow and popover
        bottom: '-5px',
        left: '-5px',
        right: '-5px',
      },
    },
    closeButton: {
      width: spacingXlarge,
      height: spacingXlarge,
      spacings: {
        top: spacingSmall,
      },
    },
    title: {
      spacings: {
        top: spacingXsmall,
      },
    },
  },
  spacings: {
    top: spacingMedium,
    left: spacingMedium,
    right: spacingMedium,
    bottom: spacingMedium,
  },
  border: {
    type: 'border',
    radius: borderRadius,
    width: 0,
  },
}
