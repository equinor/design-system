// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    text: {
      static_icons__tertiary: { rgba: enabledColor },
    },
    interactive: {
      primary__resting: { rgba: hoverColor },
      focus: { rgba: focusOutlineColor },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
} = tokens

export const breadcrumbs = {
  colors: {
    enabled: enabledColor,
    hover: hoverColor,
  },
  margin: spacingMedium,
  outline: `1px dashed ${focusOutlineColor}`,
}
