/* eslint-disable camelcase */
import { tokens } from '@equinor/eds-tokens'

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
      focus: { rgba: focusColor },
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

export const chip = {
  enabled: {
    background: backgroundColor,
    height: '24px',
    border: {
      radius: borderRadius,
    },
    spacings: {
      left: x_small,
      right: small,
    },
    typography: {
      ...chipTypography,
      color: primaryColor,
    },
    icon: {
      height: medium,
      width: medium,
      border: {
        radius: borderRadius,
      },
      hover: {
        background: primaryHoverAlt,
      },
    },
  },
  hover: {
    icon: {
      background: primaryHoverAlt,
    },
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
    border: {
      type: 'dashed',
      color: focusColor,
      width: '1px',
      radius: borderRadius,
    },
  },
  active: {
    background: activeColor,
  },
  error: {
    background: backgroundColorDefault,
    border: {
      color: errorColor,
      width: '1px',
    },
    typography: {
      color: errorColor,
    },
    icon: {
      color: errorColor,
      background: errorBackgroundHover,
    },
    hover: {
      color: errorColorHover,
    },
  },
}
