import { tokens } from '@equinor/eds-tokens'
import * as R from 'ramda'
import type { ComponentToken } from '@equinor/eds-tokens'
import { shape } from '@equinor/eds-tokens/base/shape'

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
      x_small,
    },
  },
  elevation: { temporary_nav: boxShadow },
} = tokens

export const select: ComponentToken = {
  background: colors.ui.background__default.rgba,
  boxShadow,
  minHeight: shape.straight.minHeight,
  spacings: {
    top: spacingMedium,
    right: spacingLarge,
    bottom: spacingMedium,
    left: spacingLarge,
  },
  typography: {
    ...typography.navigation.menu_title,
    color: colors.text.static_icons__tertiary.rgba,
  },
  border: {
    type: 'border',
    radius: borderRadius,
  },
  states: {
    hover: {
      background: colors.ui.background__light.rgba,
    },
  },
  entities: {
    button: {
      height: '24px',
      spacings: {
        left: spacingSmall,
        right: spacingSmall,
        top: '6px',
      },
    },
  },
  modes: {
    compact: {
      spacings: {
        left: spacingSmall,
        right: spacingSmall,
        top: spacingSmall,
        bottom: spacingSmall,
      },
      entities: {
        button: {
          height: '24px',
          spacings: {
            left: spacingSmall,
            right: spacingSmall,
            top: '0',
          },
        },
      },
    },
  },
}

export const multiSelect: ComponentToken = R.mergeDeepRight(select, {
  spacings: {
    top: '0',
    bottom: '0',
    left: spacingMediumSmall,
    right: spacingLarge,
  },
  modes: {
    compact: {
      spacings: {
        top: '2px',
        bottom: '0',
      },
    },
  },
})
