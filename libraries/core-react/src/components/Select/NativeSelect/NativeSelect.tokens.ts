import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors,
  spacings: {
    comfortable: { small, x_small },
  },
  typography,
  shape,
} = tokens

type SelectComponentToken = ComponentToken

export const nativeselect: SelectComponentToken = {
  background: colors.ui.background__light.rgba,
  typography: {
    ...typography.input.text,
    color: colors.text.static_icons__default.rgba,
  },
  entities: {
    input: {
      spacings: {
        left: small,
        right: small,
        top: '6px',
        bottom: '6px',
      },
    },
    icon: {
      width: '24px',
    },
  },
  boxShadow: 'inset 0 -1px 0 0 ' + colors.text.static_icons__tertiary.rgba,
  states: {
    focus: {
      outline: {
        type: 'outline',
        width: '2px',
        color: colors.interactive.primary__resting.rgba,
        style: 'solid',
        offset: '0px',
      },
    },
    disabled: {
      typography: {
        color: colors.interactive.disabled__text.rgba,
      },
    },
  },
  modes: {
    compact: {
      minHeight: shape._modes.compact.straight.minHeight,
      entities: {
        input: {
          spacings: {
            left: x_small,
            right: x_small,
            top: '0',
            bottom: '0',
          },
        },
      },
    },
  },
}
