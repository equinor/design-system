// @ts-nocheck
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
    padding: '12px', // 12*2 + 24 = 48
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '4px',
  },
}
