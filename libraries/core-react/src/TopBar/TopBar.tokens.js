import { tokens } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography: { navigation },
} = tokens

export const topbar = {
  height: '64px',
  background: colors.ui.background__default.rgba,
  spacings: {
    left: comfortable.xx_large,
    right: comfortable.xx_large,
    top: comfortable.small,
    bottom: comfortable.small,
  },
  border: {
    bottom: { color: colors.ui.background__light.rgba, width: '2px' },
  },
  title: { text: navigation.menu_title },
}
