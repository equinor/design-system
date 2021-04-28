import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors,
  spacings: { comfortable },
  typography,
} = tokens

type SelectComponentToken = ComponentToken

export const nativeselect: SelectComponentToken = {
  background: colors.ui.background__light.rgba,
  typography: {
    ...typography.input.text,
    color: colors.text.static_icons__tertiary.rgba,
  },
  entities: {
    input: {
      spacings: {
        left: comfortable.small,
        right: comfortable.small,
        top: '6px',
        bottom: '6px',
      },
    },
    icon: {
      width: '24px',
    },
  },
  border: {
    type: 'bordergroup',
    bottom: {
      color: colors.text.static_icons__tertiary.rgba,
      width: '1px',
      style: 'solid',
    },
  },
  states: {
    focus: {
      outline: {
        type: 'outline',
        width: '2px',
        color: colors.interactive.primary__resting.rgba,
        style: 'solid',
      },
    },
    disabled: {
      typography: {
        color: colors.interactive.disabled__text.rgba,
      },
    },
  },
}
