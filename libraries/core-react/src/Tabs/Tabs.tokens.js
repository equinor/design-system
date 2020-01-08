import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__resting: { hex: colorPrimary },
      primary__hover: { hex: primaryHover },
      primary__hover_alt: { hex: primaryHoverAlt },
    },
    tabs: {
      inactive_text: { hex: text },
    },
  },
  clickbounds: { default__base: clickbound },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
} = tokens

export const tabs = {}

export const tab = {
  backgroundColor: '#fff',
  color: colorPrimary,
  textAlign: 'center',
  borderBottom: `2px solid ${colorPrimary}`,
  clickbound,
  spacing: {
    left: spacingMedium,
    right: spacingMedium,
  },
  active: {
    enabled: {},
    focused: {
      outline: `2px dashed ${colorPrimary}`,
    },
    hover: {
      backgroundColor: primaryHoverAlt,
      color: primaryHover,
      borderColor: primaryHover,
    },
    pressed: { color: primaryHover },
  },
  inactive: {},
  disabled: {},
}
