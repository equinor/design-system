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
  // height: buttonHeight,
  typography: {
    ...buttonTypography,
    textAlign: 'center',
    fontSize: '0.875rem', // 14px - 14/16
  },
  border: {
    type: 'border',
    width: '1px',
    color: 'transparent',
    //radius: buttonBorderRadius,
    radius: '0.2857em', // 4px - 4/14
    style: 'solid',
  },
  spacings: {
    top: 'calc(0.7142em - 1px)', // calc(10px - 1px) - 10/14 (line-height er 1.143em = 16.002px)
    bottom: 'calc(0.7142em - 1px)',
    left: '1.1428em',
    right: '1.1428em',
    // left: medium,
    // right: medium,
  },
  clickbound: {
    height: clicboundHeight,
    width: '100%',
    offset: {
      top: `${(parseInt(clicboundHeight) - parseInt(buttonHeight)) / 2 + 1}px`,
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
        //radius: buttonBorderRadius,
        radius: '0.2857em', // 4px - 4/14
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
      minHeight: '1.7142em', // 24px
      spacings: {
        top: 'calc(0.2857em - 1px)', // calc(4px - 1px) - 4/14
        bottom: 'calc(0.2857em - 1px)',
      },
      clickbound: {
        height: compactClickboundHeight,
        width: '100%',
        offset: {
          top: `${
            (parseInt(compactClickboundHeight) -
              parseInt(compactButtonHeight)) /
              2 +
            1
          }px`,
          left: '0',
        },
      },
    },
  },
}
