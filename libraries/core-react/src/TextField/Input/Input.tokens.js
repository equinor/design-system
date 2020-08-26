// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

const spacings = {
  comfortable: {
    input: {
      left: comfortable.small,
      right: comfortable.small,
      top: '6px',
      bottom: '6px',
    },
    icon: {
      left: comfortable.small,
      right: comfortable.small,
      top: '10px',
      bottom: '10px',
    },
  },
  compact: {
    input: {
      left: comfortable.x_small,
      right: comfortable.x_small,
      top: comfortable.x_small,
      bottom: comfortable.x_small,
    },
    icon: {
      left: comfortable.small,
      right: comfortable.small,
      top: '10px',
      bottom: '10px',
    },
  },
}

export const input = {
  background: colors.ui.background__light.hex,
  typography: typography.input.text,
  color: colors.text.static_icons__default.hex,
  spacings,
  default: {
    icon: {
      color: colors.text.static_icons__tertiary.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      outline: { color: 'transparent', width: '1px' },
      bottom: { color: colors.text.static_icons__tertiary.hex, width: '1px' },
    },
    focus: {
      icon: {
        color: colors.interactive.primary__resting.hex,
      },
      border: {
        width: '2px',
        color: colors.interactive.primary__resting.hex,
      },
    },
  },
  error: {
    icon: {
      color: colors.interactive.danger__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      outline: { color: colors.interactive.danger__resting.hex, width: '1px' },
      bottom: { color: 'transparent', width: '1px' },
    },
    focus: {
      icon: {
        color: colors.interactive.danger__hover.hex,
      },
      border: {
        width: '2px',
        color: colors.interactive.danger__hover.hex,
      },
    },
  },
  warning: {
    icon: {
      color: colors.interactive.warning__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      bottom: { color: 'transparent', width: '1px' },
      outline: { color: colors.interactive.warning__resting.hex, width: '1px' },
    },
    focus: {
      icon: {
        color: colors.interactive.warning__hover.hex,
      },
      border: {
        width: '2px',
        color: colors.interactive.warning__hover.hex,
      },
    },
  },
  success: {
    icon: {
      color: colors.interactive.success__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      outline: { color: colors.interactive.success__resting.hex, width: '1px' },
      bottom: { color: 'transparent', width: '1px' },
    },
    focus: {
      icon: {
        color: colors.interactive.success__hover.hex,
      },
      border: {
        width: '2px',
        color: colors.interactive.success__hover.hex,
      },
    },
  },
}
