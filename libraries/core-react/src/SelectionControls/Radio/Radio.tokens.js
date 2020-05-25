import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      focus: { rgba: focusOutlineColor },
      disabled__text: { rgba: disabledText },
    },
  },
  typography: {
    navigation: { menu_title: labelTypography },
  },
} = tokens

export const radio = {
  color: {
    primary: primaryColor,
    hover: primaryHoverAlt,
    disabled: disabledText,
  },
  enabled: {
    typography: {
      ...labelTypography,
    },
    height: '48px',
    size: '10px',
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '4px',
    hover: {} /* Outline offset 2px + 2px box shadow width */,
  },
}
