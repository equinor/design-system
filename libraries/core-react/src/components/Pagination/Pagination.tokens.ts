import { tokens } from '@equinor/eds-tokens'

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

export const pagination = {
  selectedColor,
  disabledColor,
  spacingSmall,
}
