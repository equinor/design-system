import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: lighter },
      background__light: { rgba: light },
      background__medium: { rgba: mediumColor },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall, medium: spacingMedium },
  },
} = tokens

type DividerToken = ComponentToken

type DividerVariantsToken = {
  lighter: DividerToken
  light: DividerToken
  mediumColor: DividerToken
}

export const divider: DividerVariantsToken = {
  lighter: {
    background: lighter,
  },
  light: {
    background: light,
  },
  mediumColor: {
    background: mediumColor,
  },
}

export const small: DividerToken = {
  spacings: {
    top: spacingSmall,
    bottom: spacingSmall,
  },
}

export const medium: DividerToken = {
  spacings: {
    top: spacingMedium,
    bottom: spacingMedium,
  },
}
