import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

const spacings = {
  comfortable: {
    left: comfortable.small,
    right: comfortable.small,
    top: '6px',
    bottom: '6px',
  },
  compact: {
    left: comfortable.x_small,
    right: comfortable.x_small,
    top: comfortable.x_small,
    bottom: comfortable.x_small,
  },
}

export type InputVariantProps = {
  border: {
    outline: { color: string; width: string }
    bottom: { color: string; width: string }
  }
  focus: {
    icon: {
      color: string
    }
    border: {
      width: string
      color: string
    }
  }
}

type InputProps = {
  background: string
  typography: Typography
  placeholderColor: string
  spacings: {
    comfortable: Spacing
    compact: Spacing
  }
  default: InputVariantProps
  error: InputVariantProps
  warning: InputVariantProps
  success: InputVariantProps
}

export const input: InputProps = {
  background: colors.ui.background__light.hex,
  typography: {
    ...typography.input.text,
    color: colors.text.static_icons__default.hex,
  },
  placeholderColor: colors.text.static_icons__tertiary.hex,
  spacings,
  default: {
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
