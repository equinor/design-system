import { tokens } from '@equinor/eds-tokens'
import type { Elevations } from '@equinor/eds-tokens'

const {
  elevation,
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
} = tokens

export type ElevationTypes = keyof Elevations

export const paper = {
  elevation,
  background,
}
