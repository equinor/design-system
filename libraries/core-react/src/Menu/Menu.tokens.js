import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: hoverBackground },
      background__default: { rgba: background },
    },
    interactive: {
      primary__selected_highlight: { rgba: activeBackground },
      primary__resting: { rgba: activeColor },
      focus: { rgba: focusColor },
      disabled__fill: { rgba: disabledIconColor },
      disabled__text: { rgba: disabledTextColor },
    },
    text: {
      static_icons__tertiary: { rgba: textIconColor },
      static_icons__default: { rgba: textColor },
    },
  },
  elevation: { raised },
  spacings: {
    comfortable: { medium, large },
  },
  typography: {
    navigation: { menu_title: typography, label: typographyLabel },
  },
} = tokens

export const menu = {
  enabled: {
    background,
    typography: {
      ...typography,
      color: textColor,
    },
    label: {
      typography: { ...typographyLabel, color: textIconColor },
    },
    item: {
      active: {
        background: activeBackground,
        typography: { ...typography, color: activeColor },
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
    elevation: raised,
  },
}
