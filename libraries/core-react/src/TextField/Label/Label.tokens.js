import { tokens as tokens_ } from '@equinor/eds-tokens'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = tokens_

export const tokens = {
  background: colors_.ui.background__light.hex,
  color: colors_.text.static_icons__tertiary.hex,
  typography: typography_.input.label,
  spacings: {
    left: spacings_.comfortable.small,
    right: spacings_.comfortable.small,
    top: '6px',
    bottom: '6px',
  },
}
