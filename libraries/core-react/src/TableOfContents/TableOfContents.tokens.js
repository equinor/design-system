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
    corners: { borderRadius },
  },
  spacings: {
    comfortable: { small: smallSpacings },
  },
  typography: {
    paragraph: {
      caption: { fontSize, lineHeight: fontLineHeight },
    },
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
      width: '1px',
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
  links: {
    fontSize,
    fontLineHeight,
  },
  spacings: {
    comfortable: { smallSpacings },
  },
}
