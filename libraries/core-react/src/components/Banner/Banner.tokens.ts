/* eslint-disable camelcase */
import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    paragraph: { body_long: messageTypography },
  },
  spacings: {
    comfortable: { medium },
  },
  colors: {
    infographic: {
      primary__moss_green_13: { rgba: infoBackground },
      primary__energy_red_13: { rgba: warningBackground },
      primary__moss_green_100: { rgba: infoColor },
      primary__energy_red_100: { rgba: warningColor },
    },
    ui: {
      background__default: { rgba: backgroundColor },
    },
  },
  shape: {
    circle: { minHeight, minWidth, borderRadius },
  },
} = tokens

export type BannerToken = ComponentToken & {
  icon: {
    info: {
      background: string
      color: string
    }
    warning: {
      background: string
      color: string
    }
    shape: {
      minHeight: string
      minWidth: string
      borderRadius: string
    }
  }
}

export const banner: BannerToken = {
  typography: {
    ...messageTypography,
  },
  background: backgroundColor,
  spacings: {
    left: medium,
    right: medium,
    top: medium,
    bottom: medium,
  },
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
}
