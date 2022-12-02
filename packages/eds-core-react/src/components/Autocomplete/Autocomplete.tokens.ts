import { tokens } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography,
  colors,
  shape: {
    straight,
    corners: { borderRadius },
  },
  spacings: {
    comfortable: {
      small: spacingSmall,
      medium_small: spacingMediumSmall,
      medium: spacingMedium,
      large: spacingLarge,
      xx_small,
    },
  },
  elevation: { temporary_nav: boxShadow },
} = tokens

export const selectTokens: ComponentToken = {
  background: colors.ui.background__default.rgba,
  boxShadow,
  minHeight: straight.minHeight,
  spacings: {
    top: '0',
    right: spacingLarge,
    bottom: '0',
    left: spacingLarge,
  },
  typography: {
    ...typography.navigation.menu_title,
    color: colors.text.static_icons__default.rgba,
  },
  border: {
    type: 'border',
    radius: borderRadius,
  },
  states: {
    hover: {
      background: colors.ui.background__medium.rgba,
    },
    active: {
      background: colors.interactive.primary__selected_highlight.rgba,
    },
    disabled: {
      typography: {
        color: colors.interactive.disabled__text.rgba,
      },
    },
  },
  entities: {
    button: {
      height: '24px',
      width: '24px',
      spacings: {
        left: spacingSmall,
        right: spacingSmall,
        top: '6px',
      },
    },
    label: {
      spacings: {
        left: '0',
        right: '0',
        top: spacingMedium,
        bottom: spacingMedium,
      },
    },
  },
  modes: {
    compact: {
      spacings: {
        left: spacingSmall,
        right: spacingSmall,
        top: '0',
        bottom: '0',
      },
      entities: {
        button: {
          spacings: {
            left: spacingSmall,
            right: spacingSmall,
            top: '0',
          },
        },
        label: {
          spacings: {
            left: '0',
            right: '0',
            top: spacingSmall,
            bottom: spacingSmall,
          },
        },
      },
    },
  },
}

export const multiSelect: ComponentToken = mergeDeepRight(selectTokens, {
  spacings: {
    top: '0',
    bottom: '0',
    left: spacingMediumSmall,
    right: spacingLarge,
  },
  modes: {
    compact: {
      spacings: {
        top: xx_small,
        bottom: '0',
      },
    },
  },
})
