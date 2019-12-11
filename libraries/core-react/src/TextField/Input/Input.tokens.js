import baseTokens from '@equinor/eds-tokens/base'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = baseTokens

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

export const tokens = {
  background: colors_.ui.background__light.hex,
  typography: typography_.input.text,
  color: colors_.text.static_icons__default.hex,
  spacings,
  default: {
    borderBottom: colors_.text.static_icons__tertiary.hex,
    icon: {
      color: colors_.text.static_icons__tertiary.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: 'transparent',
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.primary__resting.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.primary__resting.hex,
      },
    },
  },
  error: {
    borderBottom: 'transparent',
    icon: {
      color: colors_.interactive.danger__resting.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: colors_.interactive.danger__resting.hex,
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.danger__hover.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.danger__hover.hex,
      },
    },
  },
  warning: {
    borderBottom: 'transparent',
    icon: {
      color: colors_.interactive.warning__resting.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: colors_.interactive.warning__resting.hex,
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.warning__hover.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.warning__hover.hex,
      },
    },
  },
  success: {
    borderBottom: 'transparent',
    icon: {
      color: colors_.interactive.success__resting.hex,
      disabledColor: colors_.interactive.disabled__fill.hex,
    },
    border: {
      color: colors_.interactive.success__resting.hex,
      width: '1px',
    },
    focus: {
      icon: {
        color: colors_.interactive.success__hover.hex,
      },
      border: {
        width: '2px',
        color: colors_.interactive.success__hover.hex,
      },
    },
  },
}
