import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  shape: {
    corners: { borderRadius },
  },
} = tokens

type GroupToken = ComponentToken

export const group: GroupToken = {
  border: {
    type: 'border',
    radius: borderRadius,
  },
}
