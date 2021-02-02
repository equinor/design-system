import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    infographic: {
      primary__moss_green_13: { rgba: primary13 },
      primary__moss_green_100: { rgba: primary100 },
    },
  },
} = tokens

export type CircularProgressToken = ComponentToken & {
  entities: { progress: ComponentToken }
}

export const primary: CircularProgressToken = {
  background: primary13,
  entities: {
    progress: {
      background: primary100,
    },
  },
}
