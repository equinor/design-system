import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      focus: { rgba: focusOutlineColor },
      disabled__text: { rgba: disabledText },
    },
  },
  typography: {
    navigation: { menu_title: labelTypography },
  },
  spacings: {
    comfortable: { medium_small, x_small },
  },
  clickbounds: {
    default__base: clicboundSize,
    compact__standard: compactClickboundSize,
  },
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens

type RadioToken = ComponentToken

export const comfortable: RadioToken = {
  background: primaryColor,
  typography: labelTypography,
  spacings: {
    bottom: medium_small,
    top: medium_small,
    left: medium_small,
    right: medium_small,
  },
  clickbound: {
    height: clicboundSize,
  },
  states: {
    hover: {
      background: primaryHoverAlt,
    },
    disabled: {
      background: disabledText,
    },
    focus: {
      outline: {
        type: 'outline',
        style: 'dashed',
        width: focusOutlineWidth,
        color: focusOutlineColor,
        offset: '10px',
      },
    },
  },
  modes: {
    compact: {
      spacings: {
        bottom: x_small,
        top: x_small,
        left: x_small,
        right: x_small,
      },
      clickbound: {
        height: compactClickboundSize,
      },
      states: {
        focus: {
          outline: {
            type: 'outline',
            style: 'dashed',
            width: focusOutlineWidth,
            color: focusOutlineColor,
            offset: '2px',
          },
        },
      },
    },
  },
}
