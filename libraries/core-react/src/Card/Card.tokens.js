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
    comfortable: { medium: spacingMedium },
  },
} = tokens

export const card = {
  // shape: rounded,
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
