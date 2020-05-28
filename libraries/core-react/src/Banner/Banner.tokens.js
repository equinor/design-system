/* eslint-disable camelcase */
import { tokens } from '@equinor/eds-tokens'

const {
  typography: {
    paragraph: { body_long: messageTypography },
  },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  colors: {
    ui: {
      background__default: { rgba: backgroundColorDefault },
      background__light: { rgba: backgroundColor },
    },
    interactive: {
      primary__resting: { rgba: primaryColor },

      danger__highlight: { rgba: errorBackgroundHover },
    },
  },
  shape: {
    circle: { minHeight, minWidth, borderRadius },
  },
} = tokens

export const banner = {
  enabled: {
    typography: {
      ...messageTypography,
    },
    spacings: spacingMedium,
    icon: {
      shape: {
        minHeight,
        minWidth,
        borderRadius,
      },
    },
  },
}
