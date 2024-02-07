import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: backgroundColor },
      background__default: { rgba: backgroundColorDefault },
      background__medium: { rgba: backgroundColorMedium },
    },
    interactive: {
      primary__resting: { rgba: indicatorColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      focus: { rgba: focusOutlineColor },
      disabled__fill: { rgba: backgroundColorDisabled },
      disabled__text: { rgba: textColorDisabled },
      disabled__border: { rgba: backgroundBorderDisabled },
    },
    text: {
      static_icons__tertiary: { rgba: textColor },
    },
  },
  typography: { paragraph },
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens

type SliderToken = ComponentToken

export const slider: SliderToken = {
  background: backgroundColorDefault,
  entities: {
    track: {
      background: backgroundColor,
      height: '4px',
      spacings: {
        top: '24px',
        bottom: '9px',
      },
      entities: {
        indicator: {
          background: indicatorColor,
          states: {
            hover: {
              background: primaryHover,
            },
            disabled: {
              background: backgroundBorderDisabled,
            },
          },
        },
      },
      states: {
        hover: {
          background: backgroundColorMedium,
        },
      },
    },
    output: {
      background: backgroundColorDefault,
      typography: {
        ...paragraph.caption,
        color: textColor,
      },
      states: {
        hover: {
          background: primaryHover,
        },
        disabled: {
          background: backgroundColorDisabled,
          typography: {
            color: textColorDisabled,
          },
        },
      },
    },
    handle: {
      background: backgroundColorDefault,
      height: '12px',
      width: '12px',
      border: {
        type: 'border',
        color: indicatorColor,
        radius: '50%',
        width: '2px',
        style: 'solid',
      },
      states: {
        focus: {
          outline: {
            type: 'outline',
            color: focusOutlineColor,
            width: focusOutlineWidth,
            style: 'dashed',
            offset: '3px',
          },
        },
        hover: {
          background: primaryHoverAlt,
          border: {
            type: 'border',
            color: primaryHover,
          },
        },
      },
    },
    dot: {
      height: '6px',
      width: '6px',
      border: {
        type: 'border',
        color: backgroundColorMedium,
        width: '1px',
        style: 'solid',
        radius: '50%',
      },
      spacings: {
        bottom: '8px',
      },
    },
  },
  states: {
    disabled: {
      background: backgroundColorDisabled,
      border: {
        type: 'border',
        color: backgroundColorMedium,
      },
    },
  },
}
