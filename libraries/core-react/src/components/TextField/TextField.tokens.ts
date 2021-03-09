import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const { colors, typography } = tokens

export const textfield: ComponentToken = {
  entities: {
    unit: {
      typography: {
        ...typography.input.label,
        color: colors.text.static_icons__tertiary.hex,
      },
    },
  },
}
