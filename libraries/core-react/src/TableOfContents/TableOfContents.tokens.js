import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      focus: { rgba: focusColor },
    },
    text: {
      static_icons__tertiary: { rgba: labelColor },
    },
  },
  shape: {
    // rounded: { borderRadius },
    corners: { borderRadius },
  },
} = tokens

export const tableOfContents = {
  icon: {
    fill: primaryColor,
  },
  focus: {
    border: {
      type: 'dashed',
      color: focusColor,
      width: '2px',
      borderRadius,
    },
  },
  hover: {
    background: primaryHoverAlt,
    borderRadius,
    icon: {
      background: primaryHoverAlt,
    },
    typography: {
      color: primaryHover,
    },
  },
  labelText: {
    color: labelColor,
  },
}
