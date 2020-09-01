import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: hoverBackground },
      background__default: { rgba: background },
    },
    interactive: {
      primary__selected_highlight: { rgba: activeBackground },
      primary__resting: { rgba: activeTextColor },
      focus: { rgba: focusColor },
      disabled__fill: { rgba: disabledIconColor },
      disabled__text: { rgba: disabledTextColor },
    },
    text: {
      static_icons__default: { rgba: textColor },
    },
  },
  spacings: {
    comfortable: { medium, large, small },
  },
  typography: {
    navigation: { menu_title: typography },
  },
} = tokens

export const menu = {
  enabled: {
    background,
    border: {
      radius: '4px',
    },
    typography: {
      ...typography,
      color: textColor,
    },
    item: {
      active: {
        background: activeBackground,
        textColor: activeTextColor,
      },
      spacings: {
        left: large,
        right: large,
        top: medium,
        bottom: medium,
      },
      focus: {
        outline: `2px dashed ${focusColor}`,
        outlineOffset: '2px',
      },
      hover: {
        background: hoverBackground,
      },
      disabled: {
        textColor: disabledTextColor,
        iconColor: disabledIconColor,
      },
    },
    title: {
      spacings: {
        left: large,
        right: large,
        top: small,
        bottom: small,
      },
    },
  },
}
