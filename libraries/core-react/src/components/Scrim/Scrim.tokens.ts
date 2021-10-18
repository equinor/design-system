import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__scrim: { rgba: background },
    },
  },
} = tokens

export const scrim: ComponentToken = {
  width: '100%',
  height: '100%',
  background,
}
