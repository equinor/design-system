import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing } from '@equinor/eds-tokens'

const {
  typography,
  colors,
  shape: {
    corners: { borderRadius },
  },
  spacings: {
    comfortable: {
      small: spacingSmall,
      medium_small: spacingMediumSmall,
      medium: spacingMedium,
      large: spacingLarge,
    },
  },
  elevation: { temporary_nav: boxShadow },
  clickbounds: { default__base: clickbounds },
} = tokens

type Select = {
  background: string
  boxShadow: string
  minHeight: string
  spacings: {
    single: Spacing
    multi: Spacing
  }
  typography: Typography
  borderRadius: string
  hover: {
    background: string
  }
  button: {
    size: string
    spacings: Spacing
  }
}

export const select: Select = {
  background: colors.ui.background__default.hex,
  boxShadow,
  minHeight: clickbounds,
  spacings: {
    single: {
      top: spacingMedium,
      right: spacingLarge,
      bottom: spacingMedium,
      left: spacingLarge,
    },
    multi: {
      left: spacingMediumSmall,
      right: spacingLarge,
    },
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
      left: spacingSmall,
      right: spacingSmall,
      top: '6px',
    },
  },
}
