import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__selected_highlight: { rgba: activeColor },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall },
  },
} = tokens

export const pagination = {
  activeColor,
  spacingSmall,
}
