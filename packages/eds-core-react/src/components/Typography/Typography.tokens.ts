import { ComponentToken, tokens } from '@equinor/eds-tokens'
import type { TypographyTokens } from '@equinor/eds-tokens'

const {
  typography,
  colors: colorsToken,
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens
const { heading, paragraph } = typography

const {
  interactive: {
    primary__resting: { rgba: primary },
    secondary__resting: { rgba: secondary },
    danger__resting: { rgba: danger },
    warning__resting: { rgba: warning },
    success__resting: { rgba: success },
    disabled__text: { rgba: disabled },
    focus: { rgba: focus },
  },
} = colorsToken

const colors = {
  primary,
  secondary,
  danger,
  warning,
  success,
  disabled,
}

export type QuickTypographyVariants =
  | TypographyTokens['heading']
  | TypographyTokens['paragraph']

const quickVariants: QuickTypographyVariants = {
  ...heading,
  ...paragraph,
}

type TypographyVariants =
  | keyof TypographyTokens['heading']
  | keyof TypographyTokens['paragraph']
  | keyof TypographyTokens['navigation']
  | keyof TypographyTokens['input']
  | keyof TypographyTokens['ui']
  | keyof TypographyTokens['table']

type ColorVariants =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'disabled'

type TypographyGroups = keyof typeof typography

const link: ComponentToken = {
  states: {
    focus: {
      outline: {
        width: focusOutlineWidth,
        color: focus,
        style: 'dashed',
        type: 'outline',
        offset: '2px',
      },
    },
  },
}

export { typography, colors, quickVariants, link }
export type { TypographyVariants, ColorVariants, TypographyGroups }
