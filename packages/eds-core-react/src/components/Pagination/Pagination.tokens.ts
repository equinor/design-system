import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__selected_highlight: { rgba: selectedColor },
      disabled__text: { rgba: disabledColor },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall },
  },
} = tokens

export const pagination: ComponentToken = {
  entities: {
    item: {
      states: { active: { background: selectedColor } },
    },
    icon: {
      typography: {
        color: disabledColor,
      },
    },
  },
  spacings: {
    left: spacingSmall,
  },
}
