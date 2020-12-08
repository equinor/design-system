import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

type Label = {
  background: string
  spacings: Spacing
  color: string
  typography: Typography
  disabled: {
    color: string
  }
}
export const label: Label = {
  background: colors.ui.background__light.hex,
  color: colors.text.static_icons__tertiary.hex,
  typography: typography.input.label,
  spacings: {
    left: comfortable.small,
    right: comfortable.small,
    top: '6px',
    bottom: '6px',
  },
  disabled: {
    color: colors.interactive.disabled__text.hex,
  },
}
