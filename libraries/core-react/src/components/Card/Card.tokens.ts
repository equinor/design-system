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
    corners: { borderRadius },
  },
} = tokens

export type CardToken = ComponentToken

export const primary: CardToken = {
  background: background,
  border: {
    type: 'border',
    radius: borderRadius,
    width: 0,
  },
  spacings: {
    left: spacingMedium,
    bottom: spacingMedium,
    right: spacingMedium,
    top: spacingMedium,
  },
}

export const info: CardToken = {
  background: backgroundInfo,
}
export const danger: CardToken = {
  background: backgroundDanger,
}
export const warning: CardToken = {
  background: backgroundWarning,
}
