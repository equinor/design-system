import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    logo: {
      fill_positive: { rgba: logoFillPositive },
    },
  },
} = tokens

export const token: ComponentToken = {
  background: logoFillPositive,
}
