import { tokens } from '@equinor/eds-tokens'
import type { Spacing } from '@equinor/eds-tokens'
import { ColorStateProps } from '../types'

const {
  colors,
  spacings: { comfortable },
} = tokens

type InputProps = {
  spacings: {
    comfortable: Spacing
    compact: Spacing
  }
  default: ColorStateProps
  error: ColorStateProps
  warning: ColorStateProps
  success: ColorStateProps
}

export const input: InputProps = {
  spacings: {
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
  },
  default: {
    color: colors.text.static_icons__tertiary.hex,
    disabledColor: colors.interactive.disabled__fill.hex,
    focusColor: colors.interactive.primary__resting.hex,
  },
  error: {
    color: colors.interactive.danger__resting.hex,
    disabledColor: colors.interactive.disabled__fill.hex,
    focusColor: colors.interactive.danger__hover.hex,
  },
  warning: {
    color: colors.interactive.warning__resting.hex,
    disabledColor: colors.interactive.disabled__fill.hex,
    focusColor: colors.interactive.warning__hover.hex,
  },
  success: {
    color: colors.interactive.success__resting.hex,
    disabledColor: colors.interactive.disabled__fill.hex,
    focusColor: colors.interactive.success__hover.hex,
  },
}
