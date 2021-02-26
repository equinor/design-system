import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: background },
      background__info: { rgba: backgroundInfo },
      background__warning: { rgba: backgroundWarning },
      background__danger: { rgba: backgroundDanger },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  shape: {
    corners: { minHeight, minWidth, borderRadius },
  },
} = tokens

export type CardToken = ComponentToken & {
  shape: {
    minHeight: string
    minWidth: string
    borderRadius: string
  }
  backgroundVariants: {
    default: string
    info: string
    danger: string
    warning: string
  }
}

export const card: CardToken = {
  shape: {
    minHeight,
    minWidth,
    borderRadius,
  },
  spacings: {
    left: spacingMedium,
    bottom: spacingMedium,
    right: spacingMedium,
    top: spacingMedium,
  },
  backgroundVariants: {
    default: background,
    info: backgroundInfo,
    danger: backgroundDanger,
    warning: backgroundWarning,
  },
}
