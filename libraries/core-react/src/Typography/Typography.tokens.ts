import { tokens } from '@equinor/eds-tokens'
import type { TypographyTokens } from '@equinor/eds-tokens'

const { typography, colors: colorsToken } = tokens
const { heading, paragraph } = typography

const {
  interactive: {
    primary__resting: { rgba: primary },
    secondary__resting: { rgba: secondary },
    danger__resting: { rgba: danger },
    warning__resting: { rgba: warning },
    success__resting: { rgba: success },
    disabled__text: { rgba: disabled },
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

export {
  typography,
  colors,
  quickVariants,
  TypographyVariants,
  ColorVariants,
  TypographyGroups,
}
