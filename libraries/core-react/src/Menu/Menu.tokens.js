import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { hex: background },
    },
    interactive: {
      primary__selected_highlight: { hex: activeBackground },
      primary__resting: { hex: activeColor },
    },
  },
  elevation: { raised },
  spacings: {
    comfortable: { medium, large },
  },
  typography: {
    navigation: { menu_title: typography },
  },
} = tokens

export const menu = {
  enabled: {
    background,
    typography,
    item: {
      active: {
        background: activeBackground,
        typography: { ...typography, color: activeColor },
      },
      spacings: {
        left: large,
        right: large,
        top: medium,
        bottom: medium,
      },
    },
    elevation: raised,
  },
}
