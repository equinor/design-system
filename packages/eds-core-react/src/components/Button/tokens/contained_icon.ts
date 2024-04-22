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
      top: `${
        (parseInt(clicboundHeight) - parseInt(shape.icon_button.minWidth)) / 2
      }px`,
      left: `${
        (parseInt(clicboundHeight) - parseInt(shape.icon_button.minWidth)) / 2
      }px`,
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

export const primary = mergeDeepRight(
  primaryContained,
  contained_icon,
) as ButtonToken

export const secondary = mergeDeepRight(
  secondaryContained,
  contained_icon,
) as Partial<ButtonToken>
export const danger = mergeDeepRight(
  dangerContained,
  contained_icon,
) as Partial<ButtonToken>
