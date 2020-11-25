import { tokens } from '@equinor/eds-tokens'
import type { Typography } from '@equinor/eds-tokens'

const {
  typography,
  colors,
  spacings: {
    comfortable: { medium: spacingMedium, large: spacingLarge },
  },
  elevation: { temporary_nav: boxShadow },
  clickbounds: { default__base: clickbounds },
} = tokens

type SingleSelect = {
  background: string
  boxShadow: string
  minHeight: string
  spacings: {
    top: string
    left: string
    right: string
    bottom: string
  }
  typography: Typography
  borderRadius: string
  hover: {
    background: string
  }
}

export const singleselect: SingleSelect = {
  background: colors.ui.background__default.hex,
  boxShadow,
  minHeight: clickbounds,
  spacings: {
    top: spacingMedium,
    right: spacingLarge,
    bottom: spacingMedium,
    left: spacingLarge,
  },
  typography: {
    ...typography.navigation.menu_title,
    color: colors.text.static_icons__tertiary.hex,
  },
  borderRadius: '4px',
  hover: {
    background: colors.ui.background__light.rgba,
  },
}
