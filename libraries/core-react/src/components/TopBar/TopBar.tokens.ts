import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography: { navigation },
} = tokens

type TopBarToken = ComponentToken

export const token: TopBarToken = {
  height: '64px',
  background: colors.ui.background__default.rgba,
  typography: navigation.menu_title,
  spacings: {
    left: comfortable.xx_large,
    right: comfortable.xx_large,
    top: comfortable.small,
    bottom: comfortable.small,
  },
  border: {
    type: 'bordergroup',
    bottom: {
      style: 'solid',
      color: colors.ui.background__light.rgba,
      width: '2px',
    },
  },
}
