import { tokens } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'

import { button } from './button'
import { ButtonToken } from '../Button.types'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAltColor },
      secondary__resting: { rgba: secondaryColor },
      secondary__link_hover: { rgba: secondaryHoverColor },
      secondary__highlight: { rgba: secondaryHoverAltColor },
      danger__resting: { rgba: dangerColor },
      danger__hover: { rgba: dangerHoverColor },
      danger__highlight: { rgba: dangerHoverAltColor },
    },
  },
  clickbounds: {
    default__base: clicboundHeight,
    compact__standard: compactClickboundHeight,
  },
  shape,
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens

export const primary = mergeDeepRight(button, {
  height: shape.icon_button.minHeight,
  width: shape.icon_button.minWidth,
  typography: {
    color: primaryColor,
  },
  border: {
    width: '0px',
    radius: '50%',
  },
  background: 'transparent',
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
      background: primaryHoverAltColor,
      border: {
        width: '0px',
        radius: '50%',
      },
    },
    disabled: {
      background: 'transparent',
      border: {
        color: 'transparent',
      },
    },
    focus: {
      outline: {
        offset: `-${parseInt(focusOutlineWidth)}px`,
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
}) as ButtonToken

export const secondary = mergeDeepRight(primary, {
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
}) as Partial<ButtonToken>

export const danger = mergeDeepRight(primary, {
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
}) as Partial<ButtonToken>
