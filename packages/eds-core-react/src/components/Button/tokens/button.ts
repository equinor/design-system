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
  height: `var(--eds_button__height, ${buttonHeight})`,
  typography: {
    ...buttonTypography,
    textAlign: 'center',
    fontSize: `var(--eds_button__font_size, ${buttonTypography.fontSize})`,
  },
  border: {
    type: 'border',
    width: `var(--eds_button__border_width, 1px)`,
    color: 'transparent',
    radius: `var(--eds_button__radius, ${buttonBorderRadius})`,
    style: 'solid',
  },
  spacings: {
    top: 'var(eds_button__padding_y, 0)',
    bottom: 'var(eds_button__padding_y, 0)',
    left: `var(--eds_button__padding_x, ${medium})`,
    right: `var(--eds_button__padding_x, ${medium})`,
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
      height: 'var(--eds_button__icon__size, 24px)',
      width: 'var(--eds_button__icon__size, 24px)',
    },
  },
  states: {
    hover: {
      border: {
        type: 'border',
        width: '1px',
        color: 'transparent',
        radius: `var(--eds_button__radius, ${buttonBorderRadius})`,
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
      minHeight: `var(--eds_button__height_compact, ${compactButtonHeight})`,
      spacings: {
        top: 'var(--eds_button__padding_y_compact, 0)',
        bottom: 'var(--eds_button__padding_y_compact, 0)',
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
