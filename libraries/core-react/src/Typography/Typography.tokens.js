import { tokens } from '@equinor/eds-tokens'

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
