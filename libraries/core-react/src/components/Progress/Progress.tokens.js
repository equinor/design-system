// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    infographic: {
      primary__moss_green_13: { rgba: greenBase },
      primary__moss_green_100: { rgba: greenOverlay },
    },
    logo: {
      fill_positive: { rgba: starColor },
    },
  },
} = tokens

export const progress = {
  linear: {
    background: greenBase,
    overlay: greenOverlay,
  },
  dots: {
    white: {
      color: '#fff',
    },
    green: {
      color: greenOverlay,
    },
  },
  star: {
    background: starColor,
  },
}
