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
      static_icons__primary_white: { rgba: primaryWhite },
    },
  },
  spacings: {
    comfortable: { medium, large, medium_small },
  },
} = tokens

export const sidebar: ComponentToken = {
  background,
  spacings: {
    top: large,
    bottom: large,
  },
  border: {
    type: 'bordergroup',
    right: { color: borderColor, width: '1px', style: 'solid' },
  },
  entities: {
    createItem: {
      background: createBtnColor,
      typography: {
        color: primaryWhite,
      },
      spacings: {
        right: large,
      },
      border: {
        type: 'bordergroup',
        bottom: { color: borderColor, width: '1px', style: 'solid' },
      },
      states: {
        hover: {
          background: createBtnHoverColor,
        },
      },
    },
    sidebarItem: {
      typography: {
        color: expandTextColor,
      },
      border: {
        type: 'bordergroup',
        bottom: { color: borderColor, width: '1px', style: 'solid' },
      },
      spacings: {
        bottom: medium,
      },
      states: {
        active: {
          background: menuActive,
          typography: {
            color: createBtnColor,
          },
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
      spacings: {
        right: medium,
        top: medium_small,
      },
      typography: {
        color: expandTextColor,
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
