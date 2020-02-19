import primary from '@equinor/eds-tokens/components/button/buttons-primary.json'
import secondary from '@equinor/eds-tokens/components/button/buttons-secondary.json'
import danger from '@equinor/eds-tokens/components/button/buttons-danger.json'
import disabled from '@equinor/eds-tokens/components/button/buttons-disabled.json'

const colors = {
  primary: {
    ...primary,
    ghost_icon: {
      ...primary.ghost_icon,
      typography: primary.ghost.typography,
    },
  },
  secondary: {
    ...secondary,
    ghost_icon: {
      ...secondary.ghost_icon,
      typography: secondary.ghost.typography,
    },
  },
  danger: {
    ...danger,
    ghost_icon: {
      ...danger.ghost_icon,
      typography: danger.ghost.typography,
    },
  },
  disabled: {
    ...disabled,
    ghost_icon: {
      ...disabled.ghost_icon,
      typography: disabled.ghost.typography,
    },
  },
}

export const button = {
  colors,
}
