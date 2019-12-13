import { tokens as tokens_ } from '@equinor/eds-tokens'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = tokens_

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
export const tokens = {
  background: colors_.ui.background__light.hex,
  typography: typography_.input.helper,
  spacings,
  default: {
    color: colors_.text.static_icons__tertiary.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.text.static_icons__tertiary.hex,
    },
  },
  error: {
    color: colors_.interactive.danger__resting.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.interactive.danger__hover.hex,
    },
  },
  warning: {
    color: colors_.interactive.warning__resting.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.interactive.warning__hover.hex,
    },
  },
  success: {
    color: colors_.interactive.success__resting.hex,
    disabledColor: colors_.interactive.disabled__text.hex,
    focus: {
      color: colors_.interactive.success__hover.hex,
    },
  },
}
