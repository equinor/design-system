import { tokens } from '@equinor/eds-tokens'

const {
  elevation,
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
} = tokens

export const paper = {
  elevation,
  background,
}
