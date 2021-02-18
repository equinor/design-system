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

type AccordionToken = {
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
      disabled: 'var(--eds_interactive_disabled__text)',
      activated: 'var(--eds_interactive_primary__resting)',
    },
    background: {
      default: 'var(--eds_ui_background__default)',
      hover: 'var(--eds_ui_background__light)',
    },
  },
  border: `1px solid var(--eds_ui_background__medium)`,
  outline: `1px dashed var(--eds_interactive_focus)`,
  outlineOffset: '2px',
  chevronColor: {
    default: 'var(--eds_interactive_primary__resting)',
    disabled: 'var(--eds_interactive_disabled__fill)',
  },
  iconColor: {
    interactive: {
      color: 'var(--eds_interactive_primary__resting)',
    },
    static: {
      color: 'var(--eds_text_static_icons__default)',
    },
  },
}

export const accordion: AccordionToken = token
