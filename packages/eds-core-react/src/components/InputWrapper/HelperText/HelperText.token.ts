import { tokens } from '@equinor/eds-tokens'
import type { Spacing, Typography } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

export type HelperTextProps = {
  background: string
  typography: Typography
  spacings: {
    comfortable: Spacing
    compact: Spacing
  }
}

export const helperText: HelperTextProps = {
  background: colors.ui.background__light.hex,
  typography: {
    ...typography.input.helper,
    color: colors.text.static_icons__tertiary.rgba,
  },
  spacings: {
    comfortable: {
      left: comfortable.small,
      right: comfortable.small,
      top: comfortable.small,
      bottom: '6px',
    },
    compact: {
      left: comfortable.small,
      right: comfortable.small,
      top: comfortable.xx_small,
      bottom: '6px',
    },
  },
}

const colorVariants = {
  default: {
    color: colors.text.static_icons__tertiary.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focusColor: colors.text.static_icons__tertiary.hex,
  },
  error: {
    color: colors.interactive.danger__text.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focusColor: colors.interactive.danger__hover.hex,
  },
  warning: {
    color: colors.interactive.warning__text.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focusColor: colors.interactive.warning__hover.hex,
  },
  success: {
    color: colors.interactive.success__text.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focusColor: colors.interactive.success__hover.hex,
  },
}
