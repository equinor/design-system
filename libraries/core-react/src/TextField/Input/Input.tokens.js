import { tokens } from '@equinor/eds-tokens'

const { colors, spacings: spacings_, typography } = tokens

const spacings = {
  comfortable: {
    input: {
      left: spacings_.comfortable.small,
      right: spacings_.comfortable.small,
      top: '6px',
      bottom: '6px',
    },
    icon: {
      left: spacings_.comfortable.small,
      right: spacings_.comfortable.small,
      top: '10px',
      bottom: '10px',
    },
  },
  compact: {
    input: {
      left: spacings_.comfortable.x_small,
      right: spacings_.comfortable.x_small,
      top: spacings_.comfortable.x_small,
      bottom: spacings_.comfortable.x_small,
    },
    icon: {
      left: spacings_.comfortable.small,
      right: spacings_.comfortable.small,
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
    borderBottom: colors.text.static_icons__tertiary.hex,
    icon: {
      color: colors.text.static_icons__tertiary.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      color: 'transparent',
      width: '1px',
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
    borderBottom: 'transparent',
    icon: {
      color: colors.interactive.danger__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      color: colors.interactive.danger__resting.hex,
      width: '1px',
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
    borderBottom: 'transparent',
    icon: {
      color: colors.interactive.warning__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      color: colors.interactive.warning__resting.hex,
      width: '1px',
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
    borderBottom: 'transparent',
    icon: {
      color: colors.interactive.success__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
    },
    border: {
      color: colors.interactive.success__resting.hex,
      width: '1px',
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
