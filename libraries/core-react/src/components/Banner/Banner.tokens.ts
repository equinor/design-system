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
  entities?: {
    icon: ComponentToken
  }
}

export const primary: BannerToken = {
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
  entities: {
    icon: {
      height: minHeight,
      width: minWidth,
      border: {
        type: 'border',
        radius: borderRadius,
        width: 0,
        color: 'transparent',
      },
    },
  },
}

export const info: BannerToken = {
  entities: {
    icon: {
      background: infoBackground,
      typography: {
        color: infoColor,
      },
    },
  },
}

export const warning: BannerToken = {
  entities: {
    icon: {
      background: warningBackground,
      typography: {
        color: warningColor,
      },
    },
  },
}
