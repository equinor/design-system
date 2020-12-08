import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing, Focus } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

const spacings = {
  input: {
    left: comfortable.small,
    right: comfortable.small,
    top: '6px',
    bottom: '6px',
  },
}

export type SelectVariantProps = {
  background: string
  typography: Typography
  spacings: {
    input: Spacing
  }
  default: {
    icon: {
      width: string
    }
    border: {
      outline: { color: string; width: string }
      bottom: { color: string; width: string }
    }
    focus: {
      border: Focus
    }
    disabled: {
      color: string
    }
  }
}

export const nativeselect: SelectVariantProps = {
  background: colors.ui.background__light.hex,
  typography: {
    ...typography.input.text,
    color: colors.text.static_icons__tertiary.hex,
  },
  spacings,
  default: {
    icon: {
      width: '24px',
    },
    border: {
      outline: { color: 'transparent', width: '1px' },
      bottom: { color: colors.text.static_icons__tertiary.hex, width: '1px' },
    },
    focus: {
      border: {
        width: '2px',
        color: colors.interactive.primary__resting.hex,
      },
    },
    disabled: {
      color: colors.interactive.disabled__text.hex,
    },
  },
}
