import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken, Elevations } from '@equinor/eds-tokens'

const {
  elevation,
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
} = tokens

export type ElevationTypes = keyof Elevations

export { elevation }
export const paper: ComponentToken = {
  background,
}
