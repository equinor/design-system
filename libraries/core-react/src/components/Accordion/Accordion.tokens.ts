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
  //border: Border
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
      default: `var(--eds_text_static_icons__default, ${typography.color})`,
      disabled: `var(--eds_interactive_disabled__text, ${disabledColor})`,
      activated: `var(--eds_interactive_primary__resting, ${activatedColor})`,
    },
    background: {
      default: `var(--eds_ui_background__default, ${backgroundDefault})`,
      /* Mismatch i Figma!!!! --eds_ui_background__light */
      hover: `var(--eds_ui_background__raised, ${backgroundHover})`,
    },
  },
  /* Mismatch i Figma!! 
  border: `1px solid var(--eds_ui_background__medium, ${borderColor})`,
  */
  border: `1px solid var(--eds_ui_background__lighten, ${borderColor})`,
  outline: `1px dashed var(--eds_interactive_focus, ${focusOutlineColor})`,
  outlineOffset: '2px',
  chevronColor: {
    default: `var(--eds_interactive_primary__resting, ${activatedColor})`,
    disabled: `var(--eds_interactive_disabled__fill, ${disabledIconColor})`,
  },
  iconColor: {
    interactive: {
      color: `var(--eds_interactive_primary__resting, ${activatedColor})`,
    },
    static: {
      color: `var(--eds_text_static_icons__default, ${focusHoverColor})`,
    },
  },
}

export const accordion: AccordionToken = token
