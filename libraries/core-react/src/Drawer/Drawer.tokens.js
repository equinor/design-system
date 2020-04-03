import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: backgroundColor },
      background__light: { rgba: borderColor },
    },
  },
  spacings: { comfortable },
  typography: { navigation },
} = tokens

export const drawer = {
  height: '64px',
  background: backgroundColor,
  // spacings: {
  //   left: comfortable.xx_large,
  //   right: comfortable.xx_large,
  //   top: comfortable.small,
  //   bottom: comfortable.small,
  // },
  border: {
    right: { color: borderColor, width: '2px' },
  },
}
