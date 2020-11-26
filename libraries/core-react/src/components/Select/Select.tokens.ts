import { tokens } from '@equinor/eds-tokens'
import type { Typography } from '@equinor/eds-tokens'

const {
  typography,
  colors,
  shape: {
    corners: { borderRadius },
  },
  spacings: {
    comfortable: { medium: spacingMedium, large: spacingLarge },
  },
  elevation: { temporary_nav: boxShadow },
  clickbounds: { default__base: clickbounds },
} = tokens

type Select = {
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
  button: {
    size: string
    spacings: {
      left: string
      right: string
      top: string
    }
  }
}

export const select: Select = {
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
  borderRadius,
  hover: {
    background: colors.ui.background__light.rgba,
  },
  button: {
    size: '24px',
    spacings: {
      left: '8px',
      right: '8px',
      top: '6px',
    },
  },
}
