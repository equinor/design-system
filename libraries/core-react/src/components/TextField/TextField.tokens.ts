import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors,
  typography,
  spacings: { comfortable },
} = tokens

export const textfield: ComponentToken = {
  spacings: {
    left: comfortable.small,
    right: comfortable.small,
    top: '0px',
  },
  entities: {
    unit: {
      typography: {
        ...typography.input.label,
        color: colors.text.static_icons__tertiary.hex,
      },
    },
  },
}
