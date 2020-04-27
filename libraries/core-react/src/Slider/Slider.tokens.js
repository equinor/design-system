import { tokens } from '@equinor/eds-tokens'

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
    },
    text: {
      static_icons__tertiary: { rgba: textColor },
    },
  },
  typography: { paragraph },
} = tokens

export const slider = {
  enabled: {
    background: backgroundColorDefault,
    track: {
      background: backgroundColor,
      height: '4px',
      bottomOffset: '4px',
      indicator: {
        color: indicatorColor,
      },
    },
    output: {
      height: '16px',
      typography: paragraph.overline,
      text: textColor,
    },
    handle: {
      background: backgroundColorDefault,
      size: '12px',
      border: {
        color: indicatorColor,
        radius: '50%',
        width: '2px',
        type: 'solid',
      },
      outline: `1px dashed ${focusOutlineColor}`,
      outlineOffset: '2px',
      hover: {
        background: primaryHoverAlt,
        border: {
          color: primaryHover,
        },
      },
    },
    dot: {
      size: '6px',
      border: {
        color: backgroundColorMedium,
        width: '1px',
        type: 'solid',
        radius: '50%',
      },
    },
  },
}
