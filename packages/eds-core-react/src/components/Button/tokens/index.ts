import { ButtonTokenSet } from '../Button.types'

import * as contained from './contained'
import * as outlined from './outlined'
import * as ghost from './ghost'
import * as icon from './icon'

type ButtonTokens = {
  primary: ButtonTokenSet
  secondary: ButtonTokenSet
  danger: ButtonTokenSet
}

export const token: ButtonTokens = {
  primary: {
    contained: contained.primary,
    outlined: outlined.primary,
    ghost: ghost.primary,
    ghost_icon: icon.primary,
  },
  secondary: {
    contained: contained.secondary,
    outlined: outlined.secondary,
    ghost: ghost.secondary,
    ghost_icon: icon.secondary,
  },
  danger: {
    contained: contained.danger,
    outlined: outlined.danger,
    ghost: ghost.danger,
    ghost_icon: icon.danger,
  },
}
