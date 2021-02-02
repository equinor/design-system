import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    infographic: {
      primary__moss_green_100: { rgba: primary100 },
    },
    interactive: {
      icon_on_interactive_colors: { rgba: icon_on_interactive_colors },
      danger__resting: { rgba: danger_resting },
    },
  },
} = tokens

export type DotProgressToken = ComponentToken

export const primary: DotProgressToken = {
  background: primary100,
}

export const neutral: DotProgressToken = {
  background: icon_on_interactive_colors,
}

export const tertiary: DotProgressToken = {
  background: danger_resting,
}
