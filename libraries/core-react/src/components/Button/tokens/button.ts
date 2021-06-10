import { tokens } from '@equinor/eds-tokens'
import { ButtonToken } from '../Button.types'

const {
  typography: {
    navigation: { button: buttonTypography },
  },
  colors: {
    interactive: {
      disabled__text: { rgba: disabledTextColor },
      disabled__border: { rgba: disabledBorderColor },
      disabled__fill: { rgba: disabledColor },
    },
  },
  spacings: {
    comfortable: { medium },
  },
  shape: {
    button: { minHeight: buttonHeight, borderRadius: buttonBorderRadius },
    _modes: {
      compact: {
        button: { minHeight: compactButtonHeight },
      },
    },
  },
  interactions: { focused: outline },
  clickbounds: {
    default__base: clicboundHeight,
    compact__standard: compactClickboundHeight,
  },
} = tokens

export const button: ButtonToken = {
  background: 'transparent',
  height: buttonHeight,
  typography: {
    ...buttonTypography,
    textAlign: 'center',
  },
  border: {
    type: 'border',
    width: '1px',
    color: 'transparent',
    radius: buttonBorderRadius,
    style: 'solid',
  },
  spacings: {
    left: medium,
    right: medium,
  },
  clickbound: {
    height: clicboundHeight,
    width: '100%',
    offset: {
      top: `${(parseInt(clicboundHeight) - parseInt(buttonHeight)) / 2}px`,
      left: '0',
    },
  },
  entities: {
    icon: {
      height: '24px',
      width: '24px',
    },
  },
  states: {
    hover: {
      border: {
        type: 'border',
        width: '1px',
        color: 'transparent',
        radius: buttonBorderRadius,
        style: 'solid',
      },
    },
    focus: {
      outline: {
        type: 'outline',
        offset: '2px',
        style: 'dashed',
        color: outline.color,
        width: outline.width,
      },
    },
    disabled: {
      background: disabledColor,
      border: {
        type: 'border',
        width: '1px',
        color: disabledBorderColor,
        style: 'solid',
      },
      typography: {
        ...buttonTypography,
        color: disabledTextColor,
        textAlign: 'center',
      },
    },
  },
  modes: {
    compact: {
      height: compactButtonHeight,
      clickbound: {
        height: compactClickboundHeight,
        width: '100%',
        offset: {
          top: `${
            (parseInt(compactClickboundHeight) -
              parseInt(compactButtonHeight)) /
            2
          }px`,
          left: '0',
        },
      },
    },
  },
}
