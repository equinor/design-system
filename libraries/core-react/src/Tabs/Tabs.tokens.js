import { tokens } from '@equinor/eds-tokens'

// Using states from https://material.io/design/interaction/states.html#usage
/* oversatt fra storefronten blir det da:

enabled -> inactive

*/

let {
  colors: {
    text: {
      static_icons__tertiary: { hex: defaultColor },
    },
    ui: {
      background__default: { hex: defaultBackgroundColor },
      background__medium: { hex: defaultBorderColor },
    },
    interactive: {
      focus: { hex: focusOutlineColor },
      primary__hover_alt: { hex: hoverBackgroundColor },
      primary__resting: { hex: activeColor },
      primary__hover: { hex: activeHoverColor },
    },
  },
  clickbounds: { default__base: clickbound },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
} = tokens

// debugging
// defaultColor = 'maroon'
// defaultBackgroundColor = 'yellow'
// defaultBorderColor = 'lime'
// focusOutlineColor = 'lime'
// hoverBackgroundColor = 'orange'
// activeColor = 'black'
// activeHoverColor = 'white'

export const tabs = {}

export const tab = {
  clickbound,
  spacing: {
    left: spacingMedium,
    right: spacingMedium,
  },
  states: {
    enabled: {
      backgroundColor: defaultBackgroundColor,
      color: defaultColor,
      border: {
        color: defaultBorderColor,
        style: 'solid',
        width: {
          bottom: '2px'
        }
      },
      textAlign: 'center',
    },
    disabled: {
      borderWidth: '0',
      hover: {
        cursor: 'not-allowed',
        backgroundColor: defaultBackgroundColor,
      },
    },
    hover: {
      backgroundColor: hoverBackgroundColor,
    },
    focused: {
      outline: {
        width: '2px',
        style: 'dashed',
        color: focusOutlineColor,
      },
    },
    pressed: {},
    activated: {
      color: activeColor,
      border: {
        color: activeColor
      },
      hover: {
        color: activeHoverColor,
      },
    },
  },
}
