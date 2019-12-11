import baseTokens from '@equinor/eds-tokens/base'

const {
  colors: colors_,
  spacings: spacings_,
  typography: typography_,
} = baseTokens

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
