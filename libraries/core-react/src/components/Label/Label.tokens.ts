import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

type LabelToken = ComponentToken

export const label: LabelToken = {
  background: colors.ui.background__light.hex,
  typography: {
    ...typography.input.label,
    color: colors.text.static_icons__tertiary.hex,
  },
  spacings: {
    left: comfortable.small,
    right: comfortable.small,
    top: '6px',
    bottom: '6px',
  },
  states: {
    disabled: {
      typography: {
        color: colors.interactive.disabled__text.hex,
      },
    },
  },
}
