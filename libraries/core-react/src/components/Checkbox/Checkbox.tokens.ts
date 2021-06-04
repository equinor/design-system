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
    comfortable: { medium_small },
  },
} = tokens

type CheckboxToken = ComponentToken

export const checkbox: CheckboxToken = {
  background: primaryColor,
  typography: labelTypography,
  spacings: {
    bottom: medium_small,
    top: medium_small,
    left: medium_small,
    right: medium_small,
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
        width: '1px',
        color: focusOutlineColor,
        offset: '11px',
      },
    },
  },
  entities: {
    label: {
      spacings: {
        left: medium_small,
      },
    },
  },
  modes: {
    compact: {
      spacings: {
        bottom: '6px',
        top: '6px',
        left: '6px',
        right: '6px',
      },
      states: {
        focus: {
          outline: {
            type: 'outline',
            style: 'dashed',
            width: '1px',
            color: focusOutlineColor,
            offset: '5px',
          },
        },
      },
    },
  },
}
