import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { hex: background },
    },
  },
  elevation: { raised },
  spacings: {
    comfortable: { medium },
  },
  typography: {
    navigation: { menu_title: typography },
  },
} = tokens

export const menu = {
  enabled: {
    background,
    typography,
    spacings: {
      left: medium,
      right: medium,
      top: medium,
      bottom: medium,
    },
    elevation: raised,
  },
}
