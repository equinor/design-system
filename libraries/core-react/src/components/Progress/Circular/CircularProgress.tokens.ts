import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    infographic: {
      primary__moss_green_13: { rgba: primary13 },
      primary__moss_green_100: { rgba: primary100 },
    },
    interactive: {
      icon_on_interactive_colors: { rgba: icon_on_interactive_colors },
    },
    ui: {
      background__semitransparent: { rgba: background__semitransparent },
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

export const neutral: CircularProgressToken = {
  background: background__semitransparent,
  entities: {
    progress: {
      background: icon_on_interactive_colors,
    },
  },
}
