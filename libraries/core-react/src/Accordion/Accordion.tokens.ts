import { tokens } from '@equinor/eds-tokens'
import type { Typography } from '@equinor/eds-tokens'

const {
  typography: {
    ui: { accordion_header: typography },
  },
  colors: {
    ui: {
      background__default: { rgba: backgroundDefault },
      background__medium: { rgba: borderColor },
      background__light: { rgba: backgroundHover },
    },
    text: {
      static_icons__default: { rgba: focusHoverColor },
    },
    interactive: {
      primary__resting: { rgba: activatedColor },
      disabled__fill: { rgba: disabledIconColor },
      disabled__text: { rgba: disabledColor },
      focus: { rgba: focusOutlineColor },
    },
  },
} = tokens

type AccordianToken = {
  header: {
    typography: Typography
    color: typeof token.header.color
    background: typeof token.header.background
  }
  border: string
  outline: string
  outlineOffset: string
  chevronColor: typeof token.chevronColor
  iconColor: typeof token.iconColor
}

const token = {
  header: {
    typography,
    color: {
      default: typography.color,
      disabled: disabledColor,
      activated: activatedColor,
    },
    background: {
      default: backgroundDefault,
      hover: backgroundHover,
    },
  },
  border: `1px solid ${borderColor}`,
  outline: `1px dashed ${focusOutlineColor}`,
  outlineOffset: '2px',
  chevronColor: {
    default: activatedColor,
    disabled: disabledIconColor,
  },
  iconColor: {
    interactive: {
      color: activatedColor,
    },
    static: {
      color: focusHoverColor,
    },
  },
}

export const accordion: AccordianToken = token
