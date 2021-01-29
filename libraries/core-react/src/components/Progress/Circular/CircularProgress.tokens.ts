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
  },
} = tokens

export type ProgressToken = ComponentToken & {
  entities: { progress: ComponentToken }
}

export const primary: ProgressToken = {
  background: primary13,
  entities: {
    progress: {
      background: primary100,
    },
  },
}

export const white: ProgressToken = {
  // TODO replace with token color once Figma is updated 29.01.2021
  background: 'rgba(255,255,255,0.20)',
  entities: {
    progress: {
      background: icon_on_interactive_colors,
    },
  },
}
