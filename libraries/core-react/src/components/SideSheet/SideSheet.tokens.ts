import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: background },
      background__light: { rgba: borderColor },
    },
  },
  spacings: {
    comfortable: { xx_small: spacingXXS, medium: spacingMedium },
  },
} = tokens

export const sidesheet = {
  background,
  spacings: {
    left: '14px', // padding left is 14px, because of border-left 'steals' 2px of the padding
    right: spacingMedium,
    top: spacingMedium,
  },
  border: {
    left: { color: borderColor, width: spacingXXS },
  },
  width: {
    small: '240px',
    medium: '320px',
    large: '480px',
    xlarge: '640px',
  },
}
