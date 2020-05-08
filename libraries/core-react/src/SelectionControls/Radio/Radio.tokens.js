import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: backgroundColor },
      background__default: { rgba: backgroundColorDefault },
      background__medium: { rgba: backgroundColorMedium },
    },
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      focus: { rgba: focusOutlineColor },
      disabled__text: { rgba: disabledText },
    },
    text: {
      static_icons__tertiary: { rgba: textColor },
    },
  },
} = tokens

export const radio = {
  color: {
    primary: primaryColor,
    hover: primaryHoverAlt,
    disabled: disabledText,
  },
  enabled: {
    height: '48px',
    size: '10px',
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '4px',
    hover: {} /* Outline offset 2px + 2px box shadow width */,
  },
}
