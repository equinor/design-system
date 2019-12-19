import { tokens } from '@equinor/eds-tokens'

const { colors, spacings: spacings_, typography } = tokens

const spacings = {
  comfortable: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: spacings_.comfortable.small,
    bottom: '6px',
  },
  compact: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: spacings_.comfortable.xx_small,
    bottom: '6px',
  },
}
export const helperText = {
  background: colors.ui.background__light.hex,
  typography: typography.input.helper,
  spacings,
  default: {
    color: colors.text.static_icons__tertiary.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focus: {
      color: colors.text.static_icons__tertiary.hex,
    },
  },
  error: {
    color: colors.interactive.danger__resting.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focus: {
      color: colors.interactive.danger__hover.hex,
    },
  },
  warning: {
    color: colors.interactive.warning__resting.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focus: {
      color: colors.interactive.warning__hover.hex,
    },
  },
  success: {
    color: colors.interactive.success__resting.hex,
    disabledColor: colors.interactive.disabled__text.hex,
    focus: {
      color: colors.interactive.success__hover.hex,
    },
  },
}
