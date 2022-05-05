import { tokens } from '@equinor/eds-tokens'
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
      medium: spacingMedium,
      large: spacingLarge,
    },
  },
  elevation: { temporary_nav: boxShadow },
} = tokens

export const timePicker: ComponentToken = {
  background: colors.ui.background__default.rgba,
  boxShadow,
  minHeight: straight.minHeight,
  spacings: {
    top: spacingMedium,
    right: spacingLarge,
    bottom: spacingMedium,
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
