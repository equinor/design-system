import { tokens } from '@equinor/eds-tokens'
import { button } from './button'

import { mergeDeepRight } from 'ramda'

const {
  colors: {
    text: {
      static_icons__primary_white: { rgba: primaryWhite },
    },
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover: { rgba: primaryHoverColor },
      secondary__resting: { rgba: secondaryColor },
      secondary__link_hover: { rgba: secondaryHoverColor },
      danger__resting: { rgba: dangerColor },
      danger__hover: { rgba: dangerHoverColor },
    },
  },

  shape: {
    button: { borderRadius: buttonBorderRadius },
  },
} = tokens

export const primary = mergeDeepRight(button, {
  background: primaryColor,
  typography: {
    color: primaryWhite,
  },
  border: {
    type: 'border',
    style: 'solid',
    width: '1px',
    color: primaryColor,
    radius: `var(--eds_button__radius, ${buttonBorderRadius})`,
  },
  states: {
    hover: {
      background: primaryHoverColor,
    },
  },
})
export const secondary = mergeDeepRight(primary, {
  background: secondaryColor,
  border: {
    color: secondaryColor,
  },
  states: {
    hover: {
      background: secondaryHoverColor,
      border: {
        color: secondaryHoverColor,
      },
    },
  },
})

export const danger = mergeDeepRight(primary, {
  background: dangerColor,
  border: {
    color: dangerColor,
  },
  states: {
    hover: {
      background: dangerHoverColor,
      border: {
        color: dangerHoverColor,
      },
    },
  },
})
