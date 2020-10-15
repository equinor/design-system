// @ts-nocheck
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
    padding: '12px',
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '4px',
  },
}
