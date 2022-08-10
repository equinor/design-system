import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__medium: { rgba: background__medium },
      background__default: { rgba: background },
    },
    interactive: {
      focus: { rgba: focusColor },
      primary__resting: { rgba: primary__resting },
      primary__selected_highlight: { rgba: menuActive },
      disabled__fill: { rgba: menuDisabledBackground },
      disabled__text: { rgba: menuDisabledText },
    },
    text: {
      static_icons__default: { rgba: expandTextColor },
      static_icons__primary_white: { rgba: primaryWhite },
    },
  },
  spacings: {
    comfortable: { medium, large },
  },
} = tokens

export const sidebar: ComponentToken = {
  background,
  minWidth: '66px',
  maxWidth: '256px',
  spacings: {
    top: large,
    bottom: large,
  },
  border: {
    type: 'bordergroup',
    right: { color: background__medium, width: '1px', style: 'solid' },
  },
  entities: {
    actionButton: {
      typography: {
        color: primaryWhite,
      },
      spacings: {
        right: large,
      },
    },
    sidebarItem: {
      minHeight: '48px',
      typography: {
        color: expandTextColor,
      },
      border: {
        type: 'bordergroup',
        bottom: { color: background__medium, width: '1px', style: 'solid' },
      },
      states: {
        active: {
          background: menuActive,
          typography: {
            color: primary__resting,
          },
        },
        hover: {
          background: background__medium,
        },
        focus: {
          outline: {
            color: focusColor,
            style: 'dashed',
            type: 'outline',
            width: '2px',
            offset: '-2px',
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
      },
      typography: {
        color: expandTextColor,
      },
    },
  },
  modes: {
    compact: {
      entities: {},
    },
  },
}
