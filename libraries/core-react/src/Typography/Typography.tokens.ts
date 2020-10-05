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
  | keyof typeof typography.heading
  | keyof typeof typography.paragraph
  | keyof typeof typography.navigation
  | keyof typeof typography.input
  | keyof typeof typography.ui
  | keyof typeof typography.table

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
