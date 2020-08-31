// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__scrim: { rgba: background },
    },
  },
} = tokens

export const scrim = {
  width: '100vw',
  height: '100vh',
  background,
}
