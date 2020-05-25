import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__resting: { hex: primaryColorHex },
      primary__hover_alt: { rgba: primaryHoverAlt },
      focus: { rgba: focusOutlineColor },
      disabled__text: { rgba: disabledText },
    },
  },
  typography: {
    navigation: { menu_title: labelTypography },
  },
} = tokens

export const checkbox = {
  color: {
    primary: primaryColor,
    primaryHex: primaryColorHex,
    hover: primaryHoverAlt,
    disabled: disabledText,
  },
  enabled: {
    typography: {
      ...labelTypography,
    },
    height: '48px',
    size: '16px',
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '4px',
    hover: {} /* Outline offset 2px + 2px box shadow width */,
  },
}
