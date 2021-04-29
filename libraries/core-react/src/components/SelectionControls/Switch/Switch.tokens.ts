import { ComponentToken, tokens } from '@equinor/eds-tokens'
import * as R from 'ramda'

const {
  colors: {
    ui: {
      background__medium: { rgba: backgroundColorMedium },
    },
    interactive: {
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      primary__selected_highlight: { rgba: activeColor },
      primary__resting: { rgba: primaryResting },
      disabled__fill: { rgba: backgroundDisabled },
      focus: { rgba: focusOutlineColor },
      icon_on_interactive_colors: { rgba: iconInteractive },
    },
    text: {
      static_icons__tertiary: { rgba: iconTertiary },
    },
  },
  typography: {
    navigation: { menu_title: labelTypography },
  },
  clickbounds,
  elevation: { raised: boxShadow },
} = tokens

type SwitchToken = ComponentToken

export const comfortable: SwitchToken = {
  typography: labelTypography,
  clickbound: {
    height: clickbounds.default__base,
    width: clickbounds.default__base,
    offset: { top: '0' },
  },
  entities: {
    track: {
      width: '34px',
      height: '8px',
      background: backgroundColorMedium,
      border: {
        type: 'border',
        radius: '4px',
      },
      states: {
        active: {
          background: activeColor,
        },
        hover: {
          background: primaryHover,
        },
      },
    },
    handle: {
      height: '16px',
      width: '16px',
      boxShadow,
      background: iconTertiary,
      states: {
        active: {
          background: primaryResting,
        },
        hover: {
          background: primaryHoverAlt,
        },
      },
    },
  },
  modes: {
    compact: {
      entities: {
        track: {
          width: '20px',
          height: '10px',
          states: {
            disabled: {
              background: iconTertiary,
            },
            active: {
              background: primaryResting,
            },
          },
        },
        handle: {
          height: '6px',
          width: '6px',
          background: iconInteractive,
        },
      },
    },
  },
  states: {
    disabled: {
      background: backgroundDisabled,
    },
    focus: {
      outline: {
        width: '1px',
        type: 'outline',
        style: 'dashed',
        color: focusOutlineColor,
        offset: '6px',
      },
    },
    hover: {
      background: primaryHoverAlt,
      entities: {
        handle: {
          background: primaryHover,
          // small: {
          //   background: primaryHoverAlt,
          // },
        },
        track: {
          // small: {
          //   background: primaryHover,
          // },
        },
      },
    },
  },
}
