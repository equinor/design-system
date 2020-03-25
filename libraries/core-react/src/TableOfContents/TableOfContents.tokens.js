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

export const tableOfContents = {
  icon: {
    fill: primaryColor,
  },
  focus: {
    border: {
      type: 'dashed',
      color: focusColor,
      width: '1px',
      radius: borderRadius,
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
}
