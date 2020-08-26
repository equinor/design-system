// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
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

const focused = {
  outline: {
    width: '1px',
    style: 'dashed',
    color: focusOutlineColor,
  },
  outlineOffset: '2px',
}
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
          bottom: '2px',
        },
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
    focused,
    pressed: {},
    activated: {
      color: activeColor,
      border: {
        color: activeColor,
      },
      hover: {
        color: activeHoverColor,
      },
    },
  },
}

export const tabPanel = {
  spacing: {
    top: spacingMedium,
    bottom: spacingMedium,
  },
  focused,
}
