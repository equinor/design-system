import { tokens } from '@equinor/eds-tokens'

const {
  // shape: { rounded },
  colors: {
    ui: {
      background__default: { rgba: background },
      background__info: { rgba: backgroundInfo },
      background__warning: { rgba: backgroundWarning },
      background__danger: { rgba: backgroundDanger },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium, large: spacingLarge },
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
    last: {
      top: spacingMedium,
      bottom: spacingLarge,
    },
    middle: {
      top: spacingMedium,
      bottom: spacingMedium,
    },
    leading: {
      top: 0,
      marginLeft: '-16px',
      bottom: spacingLarge,
    },
  },
  background: {
    default: background,
    info: backgroundInfo,
    danger: backgroundDanger,
    warning: backgroundWarning,
  },
}
