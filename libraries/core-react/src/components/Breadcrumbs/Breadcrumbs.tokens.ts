import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

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

export const breadcrumbs: ComponentToken = {
  spacings: {
    left: spacingMedium,
    right: spacingMedium,
  },
  typography: {
    color: enabledColor,
  },
  states: {
    hover: {
      typography: {
        color: hoverColor,
      },
    },
    focus: {
      outline: {
        width: '1px',
        color: focusOutlineColor,
        style: 'dashed',
        type: 'outline',
        offset: '6px',
      },
    },
  },
}
