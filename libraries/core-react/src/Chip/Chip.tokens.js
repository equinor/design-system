import { tokens } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { small, medium },
  },
  typography: {
    ui: { chip__badge: chipTypography },
  },
  colors: {
    ui: {
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
      left: small,
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
      width: '2px',
      radius: borderRadius,
    },
  },
  active: {
    background: activeColor,
  },
  error: {
    border: {
      color: errorColor,
    },
    typography: {
      color: errorColor,
    },
  },
}
