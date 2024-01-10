import { tokens } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'
import type { ComponentToken } from '@equinor/eds-tokens'

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
      x_large,
      xxx_large,
    },
  },
  elevation: { temporary_nav: boxShadow },
} = tokens

export type AutocompleteToken = ComponentToken & {
  variants: {
    error: ComponentToken
    warning: ComponentToken
    success: ComponentToken
  }
}

export const selectTokens: AutocompleteToken = {
  background: colors.ui.background__default.rgba,
  boxShadow,
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
  variants: {
    error: {
      typography: {
        color: colors.interactive.danger__text.rgba,
      },
    },
    warning: {
      typography: {
        color: colors.interactive.warning__text.rgba,
      },
    },
    success: {
      typography: {
        color: colors.interactive.success__text.rgba,
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
      minHeight: xxx_large,
      spacings: {
        left: '0',
        right: '0',
        top: spacingMedium,
        bottom: spacingMedium,
      },
    },
    noOptions: {
      typography: {
        color: colors.text.static_icons__tertiary.rgba,
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
          minHeight: x_large,
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

export const multiSelect = mergeDeepRight(selectTokens, {
  spacings: {
    top: '0',
    bottom: '0',
    left: spacingMediumSmall,
    right: spacingLarge,
  },
  modes: {
    compact: {
      spacings: {
        top: '0', //xx_small,
        bottom: '0',
      },
    },
  },
}) as AutocompleteToken
