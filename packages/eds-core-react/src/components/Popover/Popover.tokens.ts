import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    ui: { accordion_header: header },
  },
  colors: {
    ui: {
      background__default: { rgba: background },
    },
    interactive: {
      focus: { rgba: focusOutlineColor },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium, small: spacingSmall },
  },
  shape: {
    corners: { borderRadius },
  },
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens

type Popover = ComponentToken

export const popover: Popover = {
  background,
  typography: header,
  maxWidth: '560px',
  maxHeight: '80vh',
  entities: {
    arrow: {
      width: '6px',
      height: spacingSmall,
      spacings: {
        top: '-5px', // 1px less than arrow width, if not the shadow would show between arrow and popover
        bottom: '-5px',
        left: '-5px',
        right: '-5px',
      },
    },
    title: {
      spacings: {
        top: '12px',
      },
    },
    paper: {
      states: {
        focus: {
          outline: {
            type: 'outline',
            width: focusOutlineWidth,
            style: 'dashed',
            color: focusOutlineColor,
          },
        },
      },
    },
  },
  spacings: {
    top: spacingMedium,
    left: spacingMedium,
    right: spacingMedium,
    bottom: spacingMedium,
  },
  border: {
    type: 'border',
    radius: borderRadius,
  },
  modes: {
    compact: {},
  },
}
