import { tokens } from '@equinor/eds-tokens'
import type { Spacing } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
} = tokens

const spacings = {
  comfortable: {
    left: comfortable.small,
    right: comfortable.small,
    top: '10px',
    bottom: '10px',
  },
  compact: {
    left: comfortable.small,
    right: comfortable.small,
    top: '10px',
    bottom: '10px',
  },
}

export type InputVariantProps = {
  icon: {
    color: string
    disabledColor: string
    focus: {
      color: string
    }
  }
}

type InputProps = {
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
  spacings,
  default: {
    icon: {
      color: colors.text.static_icons__tertiary.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
      focus: {
        color: colors.interactive.primary__resting.hex,
      },
    },
  },
  error: {
    icon: {
      color: colors.interactive.danger__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
      focus: {
        color: colors.interactive.danger__hover.hex,
      },
    },
  },
  warning: {
    icon: {
      color: colors.interactive.warning__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
      focus: {
        color: colors.interactive.warning__hover.hex,
      },
    },
  },
  success: {
    icon: {
      color: colors.interactive.success__resting.hex,
      disabledColor: colors.interactive.disabled__fill.hex,
      focus: {
        color: colors.interactive.success__hover.hex,
      },
    },
  },
}
