import { tokens } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'

import {
  primary as primaryContained,
  secondary as secondaryContained,
  danger as dangerContained,
} from './contained'
import { ButtonToken } from '../Button.types'

const {
  clickbounds: {
    default__base: clicboundHeight,
    compact__standard: compactClickboundHeight,
  },
  shape,
} = tokens

const contained_icon = {
  height: shape.icon_button.minHeight,
  width: shape.icon_button.minWidth,
  border: {
    width: '0px',
    radius: '50%',
  },
  spacings: { left: '0', right: '0' },
  clickbound: {
    width: clicboundHeight,
    offset: {
      top: '0',
      left: `${(parseInt(clicboundHeight) - parseInt('40px')) / 2}px`,
    },
  },
  states: {
    hover: {
      border: {
        width: '0px',
        radius: '50%',
      },
    },
  },
  modes: {
    compact: {
      height: shape._modes.compact.icon_button.minHeight,
      width: shape._modes.compact.icon_button.minWidth,
      clickbound: {
        width: compactClickboundHeight,
        offset: {
          top: '0',
          left: `${
            (parseInt(compactClickboundHeight) -
              parseInt(shape._modes.compact.icon_button.minWidth)) /
            2
          }px`,
        },
      },
    },
  },
}

export const primary: ButtonToken = mergeDeepRight(
  primaryContained,
  contained_icon,
)

export const secondary: Partial<ButtonToken> = mergeDeepRight(
  secondaryContained,
  contained_icon,
)
export const danger: Partial<ButtonToken> = mergeDeepRight(
  dangerContained,
  contained_icon,
)
