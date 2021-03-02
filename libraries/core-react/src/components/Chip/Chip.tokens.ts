import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { x_small, small, medium },
  },
  typography: {
    ui: { chip__badge: chipTypography },
  },
  colors: {
    ui: {
      background__default: { rgba: backgroundColorDefault },
      background__light: { rgba: backgroundColor },
    },
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      disabled__text: { rgba: disabledColor },
      focus: { rgba: focusOutlineColor },
      primary__selected_highlight: { rgba: activeColor },
      danger__resting: { rgba: errorColor },
      danger__hover: { rgba: errorColorHover },
      danger__highlight: { rgba: errorBackgroundHover },
    },
  },
  shape: {
    rounded: { borderRadius },
  },
} = tokens

export type ChipToken = ComponentToken & {
  entities: { icon: ComponentToken }
}

export const primary: ChipToken = {
  background: backgroundColor,
  height: '22px',
  border: {
    radius: borderRadius,
    color: 'transparent',
    type: 'border',
    width: '1px',
  },
  spacings: {
    left: x_small,
    right: small,
  },
  typography: {
    ...chipTypography,
    color: primaryColor,
  },

  states: {
    hover: {
      typography: {
        color: primaryHover,
      },
    },
    disabled: {
      typography: {
        color: disabledColor,
      },
    },
    focus: {
      outline: {
        width: '1px',
        color: focusOutlineColor,
        style: 'dashed',
        type: 'outline',
        offset: '2px',
      },
    },
    active: {
      background: activeColor,
    },
  },
  entities: {
    icon: {
      height: medium,
      width: medium,
      border: {
        radius: borderRadius,
        type: 'border',
        width: 0,
      },
      states: {
        hover: {
          background: primaryHoverAlt,
        },
      },
    },
  },
}

export const error: ChipToken = {
  background: backgroundColorDefault,
  border: {
    type: 'border',
    color: errorColor,
    width: '1px',
    style: 'solid',
    radius: borderRadius,
  },
  typography: {
    color: errorColor,
  },
  states: {
    hover: {
      typography: {
        color: errorColorHover,
      },
    },
  },
  entities: {
    icon: {
      typography: {
        color: errorColor,
      },
      background: errorBackgroundHover,
    },
  },
}
