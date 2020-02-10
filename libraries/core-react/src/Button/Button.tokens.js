import primaryButtonTokens from '@equinor/eds-tokens/components/button/buttons-primary.json'
import secondaryButtonTokens from '@equinor/eds-tokens/components/button/buttons-secondary.json'
import dangerButtonTokens from '@equinor/eds-tokens/components/button/buttons-danger.json'
import disabledButtonTokens from '@equinor/eds-tokens/components/button/buttons-disabled.json'

const colors = {
  primary: primaryButtonTokens,
  secondary: secondaryButtonTokens,
  danger: dangerButtonTokens,
  disabled: disabledButtonTokens,
  icon: primaryButtonTokens.ghost_icon,
}

export const button = {
  colors,
}
