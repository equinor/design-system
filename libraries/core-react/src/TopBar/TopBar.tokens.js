import { tokens } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
} = tokens

export const topbar = {
  height: '64px',
  spacings: {
    left: comfortable.xxx_large,
    right: comfortable.xxx_large,
    top: comfortable.small,
    bottom: comfortable.small,
  },
  border: {
    bottom: { color: colors.ui.background__light.rgba, width: '2px' },
  },
}
