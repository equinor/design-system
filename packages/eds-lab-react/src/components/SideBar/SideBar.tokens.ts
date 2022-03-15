import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__medium: { rgba: borderColor },
      background__default: { rgba: background },
    },
    interactive: {
      focus: { rgba: focusColor },
      primary__hover: { rgba: createBtnHoverColor },
      primary__resting: { rgba: createBtnColor },
      primary__selected_highlight: { rgba: menuActive },
      primary__selected_hover: { rgba: menuHover },
      secondary__highlight: { rgba: expandHover },
      disabled__fill: { rgba: menuDisabledBackground },
      disabled__text: { rgba: menuDisabledText },
    },
    text: {
      static_icons__default: { rgba: expandTextColor },
      static_icons__primary_white: { rgba: createTextColor },
    },
  },
  spacings: {
    comfortable: { medium, large, medium_small },
  },
  shape: {
    icon_button: { borderRadius: iconBorderRadius },
    button: { borderRadius: buttonBorderRadius },
  },
} = tokens

type SideBarToken = ComponentToken

export const menu: SideBarToken = {
  background,
  spacings: {
    top: large,
    bottom: large,
  },
  border: {
    type: 'border',
    color: borderColor,
    width: '1px',
  },
  entities: {
    createItem: {
      background: createBtnColor,
      typography: {
        color: createTextColor,
      },
      spacings: {
        right: large,
      },
      border: {
        type: 'border',
        color: borderColor,
        width: '1px',
        radius: iconBorderRadius,
      },
      states: {
        hover: {
          background: createBtnHoverColor,
        },
      },
    },
    menuItem: {
      typography: {
        color: expandTextColor,
      },
      spacings: {
        bottom: medium,
      },
      states: {
        active: {
          background: menuActive,
        },
        hover: {
          background: menuHover,
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
        disabled: {
          background: menuDisabledBackground,
          typography: {
            color: menuDisabledText,
          },
        },
      },
    },
    toggleOpen: {
      border: {
        radius: buttonBorderRadius,
      },
      spacings: {
        right: medium,
        top: medium_small,
      },
      states: {
        hover: {
          background: expandHover,
        },
      },
    },
  },
  modes: {
    compact: {
      entities: {},
    },
  },
}
