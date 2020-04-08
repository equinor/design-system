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
    comfortable: {
      small: spacingSmall,
      medium: spacingMedium,
      large: spacingLarge,
    },
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
      width: '100%',
    },
    middle: {
      top: spacingMedium,
      bottom: spacingMedium,
      width: '100%',
    },
    leading: {
      top: 0,
      marginLeft: '-16px',
      bottom: spacingMedium,
      width: 'calc(100% + 32px)',
    },
    actions: {
      top: spacingSmall,
      bottom: spacingSmall,
      left: spacingSmall,
      right: spacingSmall,
    },
  },
  background: {
    default: background,
    info: backgroundInfo,
    danger: backgroundDanger,
    warning: backgroundWarning,
  },
}
