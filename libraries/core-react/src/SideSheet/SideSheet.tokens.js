import { tokens } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
} = tokens

export const sidesheet = {
  background: colors.ui.background__default.rgba,
  spacings: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: comfortable.medium,
  },
  border: {
    left: { color: colors.ui.background__light.rgba, width: '2px' },
  },
}
