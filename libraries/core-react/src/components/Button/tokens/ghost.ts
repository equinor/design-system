import { tokens } from '@equinor/eds-tokens'
import * as R from 'ramda'
import { button } from './button'
import { ButtonToken } from '../Button.types'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover: { rgba: primaryHoverColor },
      primary__hover_alt: { rgba: primaryHoverAltColor },
      secondary__resting: { rgba: secondaryColor },
      secondary__link_hover: { rgba: secondaryHoverColor },
      secondary__highlight: { rgba: secondaryHoverAltColor },
      danger__resting: { rgba: dangerColor },
      danger__hover: { rgba: dangerHoverColor },
      danger__highlight: { rgba: dangerHoverAltColor },
    },
  },
} = tokens

export const primary: ButtonToken = R.mergeDeepRight(button, {
  typography: {
    color: primaryColor,
  },
  states: {
    hover: {
      background: primaryHoverAltColor,
      typography: {
        color: primaryHoverColor,
      },
    },
    disabled: {
      background: 'transparent',
      border: {
        color: 'transparent',
      },
    },
  },
})

export const secondary: Partial<ButtonToken> = R.mergeDeepRight(primary, {
  typography: {
    color: secondaryColor,
  },
  states: {
    hover: {
      background: secondaryHoverAltColor,
      typography: {
        color: secondaryHoverColor,
      },
    },
  },
})

export const danger: Partial<ButtonToken> = R.mergeDeepRight(primary, {
  typography: {
    color: dangerColor,
  },
  states: {
    hover: {
      background: dangerHoverAltColor,
      typography: {
        color: dangerHoverColor,
      },
    },
  },
})
