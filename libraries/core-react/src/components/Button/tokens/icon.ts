import { tokens } from '@equinor/eds-tokens'
import * as R from 'ramda'

import { button } from './button'
import { ButtonToken } from '../Button.types'

const {
  colors: {
    interactive: {
      primary__hover_alt: { rgba: primaryHoverAltColor },
      secondary__resting: { rgba: secondaryColor },
      secondary__link_hover: { rgba: secondaryHoverColor },
      secondary__highlight: { rgba: secondaryHoverAltColor },
      danger__resting: { rgba: dangerColor },
      danger__hover: { rgba: dangerHoverColor },
      danger__highlight: { rgba: dangerHoverAltColor },
    },
  },
  clickbounds: { default__base: clicboundHeight },
} = tokens

const buttonSize = 40

export const primary: ButtonToken = R.mergeDeepRight(button, {
  height: `${buttonSize}px`,
  width: `${buttonSize}px`,
  border: {
    radius: '50%',
  },
  background: 'transparent',
  spacings: { left: '0', right: '0' },
  clickbound: {
    width: clicboundHeight,
    offset: {
      left: `${(parseInt(clicboundHeight) - buttonSize) / 2}px`,
    },
  },
  states: {
    hover: {
      background: primaryHoverAltColor,
      border: {
        radius: '50%',
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
