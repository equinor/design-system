import { tokens } from '@equinor/eds-tokens'

const { typography, colors: colorsToken } = tokens
const { heading, paragraph } = typography

const {
  interactive: {
    primary__resting: { hex: primary },
    secondary__resting: { hex: secondary },
    danger__resting: { hex: danger },
    warning__resting: { hex: warning },
    success__resting: { hex: success },
    disabled__text: { hex: disabled },
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

const groupNames = Object.keys(tokens.typography)

// Only used for propTypes as groups have duplicate variants
const variantNames = Object.keys(
  Object.entries({ ...tokens.typography }).reduce(
    (acc, [, val]) => ({ ...acc, ...val }),
    {},
  ),
)

const colorNames = Object.keys(colors)

const quickVariants = {
  ...heading,
  ...paragraph,
}

export {
  typography,
  colors,
  quickVariants,
  colorNames,
  groupNames,
  variantNames,
}
