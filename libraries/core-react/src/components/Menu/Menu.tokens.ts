import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: background },
    },
    interactive: {
      primary__selected_highlight: { rgba: activeBackground },
      primary__resting: { rgba: activeTextColor },
      focus: { rgba: focusColor },
      disabled__fill: { rgba: disabledIconColor },
      disabled__text: { rgba: disabledTextColor },
      table__header__fill_hover: { rgba: hoverBackground },
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

type MenuToken = ComponentToken

export const menu: MenuToken = {
  background,
  spacings: {
    top: small,
    bottom: small,
  },
  border: {
    type: 'border',
    radius: '4px',
  },
  typography: {
    ...typography,
    color: textColor,
  },
  entities: {
    icon: {
      states: {
        disabled: {
          typography: {
            color: disabledIconColor,
          },
        },
      },
    },
    item: {
      spacings: {
        left: large,
        right: large,
        top: medium,
        bottom: medium,
      },
      states: {
        active: {
          typography: {
            ...typography,
            color: activeTextColor,
          },
          background: activeBackground,
        },
        focus: {
          outline: {
            color: focusColor,
            style: 'dashed',
            type: 'outline',
            width: '2px',
            offset: '2px',
          },
        },
        hover: {
          background: hoverBackground,
        },
        disabled: {
          typography: {
            ...typography,
            color: disabledTextColor,
          },
        },
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
