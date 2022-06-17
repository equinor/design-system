import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    text: {
      static_icons__tertiary: { rgba: defaultColor },
    },
    ui: {
      background__medium: { rgba: defaultBorderColor },
    },
    interactive: {
      focus: { rgba: focusOutlineColor },
      primary__hover_alt: { rgba: hoverBackgroundColor },
      primary__resting: { rgba: activeColor },
      primary__hover: { rgba: activeHoverColor },
    },
  },
  clickbounds: { default__base: clickboundsHeight },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  interactions: {
    focused: { width: focusOutlineWidth },
  },
  typography: {
    navigation: { menu_tabs, menu_title },
  },
} = tokens

export const token: ComponentToken = {
  entities: {
    panel: {
      spacings: {
        top: spacingMedium,
        bottom: spacingMedium,
      },
      states: {
        focus: {
          outline: {
            type: 'outline',
            width: focusOutlineWidth,
            style: 'dashed',
            color: focusOutlineColor,
          },
        },
      },
      typography: {
        ...menu_title,
      },
    },
    tab: {
      background: 'transparent',
      height: clickboundsHeight,
      clickbound: {
        height: clickboundsHeight,
        offset: {
          top: '2px',
        },
      },
      spacings: {
        left: spacingMedium,
        right: spacingMedium,
      },
      typography: {
        color: defaultColor,
        textAlign: 'center',
        ...menu_tabs,
      },
      border: {
        type: 'bordergroup',
        bottom: {
          color: defaultBorderColor,
          style: 'solid',
          width: '2px',
        },
      },
      states: {
        disabled: {
          border: {
            type: 'border',
            width: 0,
            color: 'transparent',
            style: 'solid',
          },
        },
        hover: {
          background: hoverBackgroundColor,
        },
        focus: {
          outline: {
            type: 'outline',
            width: focusOutlineWidth,
            offset: `-${parseInt(focusOutlineWidth)}px`,
            style: 'dashed',
            color: focusOutlineColor,
          },
        },
        active: {
          typography: {
            color: activeColor,
          },
          border: {
            type: 'bordergroup',
            bottom: {
              color: activeColor,
              style: 'solid',
              width: '2px',
            },
          },
          states: {
            hover: {
              typography: {
                color: activeHoverColor,
              },
            },
          },
        },
      },
    },
  },
  modes: {
    compact: {},
  },
}
