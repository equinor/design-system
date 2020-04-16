import { tokens } from '@equinor/eds-tokens'

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

export const card = {
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
  background: {
    default: background,
    info: backgroundInfo,
    danger: backgroundDanger,
    warning: backgroundWarning,
  },
}
