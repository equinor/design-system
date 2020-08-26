// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

export const label = {
  background: colors.ui.background__light.hex,
  color: colors.text.static_icons__tertiary.hex,
  typography: typography.input.label,
  spacings: {
    left: comfortable.small,
    right: comfortable.small,
    top: '6px',
    bottom: '6px',
  },
}
