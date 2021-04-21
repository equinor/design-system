import type { ComponentToken } from '@equinor/eds-tokens'

type AvatarToken = ComponentToken & {
  states: {
    disabled: {
      opacity: string
    }
  }
}

export const avatar: AvatarToken = {
  border: {
    type: 'border',
    radius: '50%',
    width: 0,
  },
  states: {
    disabled: {
      opacity: '0.5',
    },
  },
}
