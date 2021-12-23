import type { ComponentToken } from '@equinor/eds-tokens'

export type ButtonToken = ComponentToken & {
  entities?: {
    icon: ComponentToken
  }
}

export type ButtonTokenSet = {
  contained: ButtonToken
  outlined: ButtonToken
  ghost: ButtonToken
  ghost_icon: ButtonToken
}
