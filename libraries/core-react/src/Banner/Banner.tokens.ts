/* eslint-disable camelcase */
// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
  typography: {
    paragraph: { body_long: messageTypography },
  },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  colors: {
    infographic: {
      primary__moss_green_13: { rgba: infoBackground },
      primary__energy_red_13: { rgba: warningBackground },
      primary__moss_green_100: { rgba: infoColor },
      primary__energy_red_100: { rgba: warningColor },
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
      info: {
        background: infoBackground,
        color: infoColor,
      },
      warning: {
        background: warningBackground,
        color: warningColor,
      },

      shape: {
        minHeight,
        minWidth,
        borderRadius,
      },
    },
  },
}
