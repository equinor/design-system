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

  shape: {
    button: { borderRadius: buttonBorderRadius },
  },
} = tokens

export const primary: ButtonToken = R.mergeDeepRight(button, {
  typography: {
    color: primaryColor,
  },
  border: {
    type: 'border',
    width: '1px',
    color: primaryColor,
    radius: buttonBorderRadius,
  },
  states: {
    hover: {
      typography: {
        color: primaryHoverColor,
      },
      background: primaryHoverAltColor,
      border: {
        type: 'border',
        width: '1px',
        color: primaryHoverColor,
      },
    },
    disabled: {
      background: 'transparent',
    },
  },
})

export const secondary: ButtonToken = R.mergeDeepRight(primary, {
  typography: {
    color: secondaryColor,
  },
  border: {
    color: secondaryColor,
  },
  states: {
    hover: {
      background: secondaryHoverAltColor,
      typography: {
        color: secondaryHoverColor,
      },
      border: {
        color: secondaryHoverColor,
      },
    },
  },
})

export const danger: ButtonToken = R.mergeDeepRight(primary, {
  typography: {
    color: dangerColor,
  },
  border: {
    color: dangerColor,
  },
  states: {
    hover: {
      background: dangerHoverAltColor,
      typography: {
        color: dangerHoverColor,
      },
      border: {
        color: dangerHoverColor,
      },
    },
  },
})
