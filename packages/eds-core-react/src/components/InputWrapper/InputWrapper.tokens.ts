import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'

const {
  colors: {
    ui: {
      background__light: { rgba: background },
    },
    text: { static_icons__default, static_icons__tertiary },
    interactive: {
      disabled__text,
      primary__resting,
      danger__resting,
      danger__hover,
      warning__resting,
      warning__hover,
      success__resting,
      success__hover,
    },
  },
  spacings: {
    comfortable: { small, x_small },
  },
  typography,
  shape,
} = tokens

export type InputToken = ComponentToken & {
  entities: {
    placeholder: ComponentToken
    helperText: ComponentToken
  }
}

export const input: InputToken = {
  minHeight: shape.straight.minHeight,
  background,
  spacings: {
    left: small,
    right: small,
    top: '6px',
    bottom: '6px',
  },
  typography: {
    ...typography.input.text,
    color: static_icons__default.rgba,
  },
  entities: {
    placeholder: {
      typography: {
        color: static_icons__tertiary.rgba,
      },
    },

    helperText: {
      typography: {
        ...typography.input.label,
        color: static_icons__tertiary.rgba,
      },
      states: {
        disabled: {
          typography: {
            color: disabled__text.rgba,
          },
        },
      },
    },
  },
  states: {
    disabled: {
      typography: {
        color: disabled__text.rgba,
      },
    },
    readOnly: {
      background: 'transparent',
      boxShadow: 'none',
    },
    active: {
      outline: {
        type: 'outline',
        color: 'transparent',
        width: '1px',
        style: 'solid',
        offset: '0px',
      },
    },
    focus: {
      outline: {
        type: 'outline',
        width: '2px',
        color: primary__resting.rgba,
        style: 'solid',
        offset: '0px',
      },
    },
  },
  boxShadow: 'inset 0px -1px 0px 0px ' + static_icons__tertiary.rgba,
  modes: {
    compact: {
      minHeight: shape._modes.compact.straight.minHeight,
      spacings: {
        left: x_small,
        right: x_small,
        top: x_small,
        bottom: x_small,
      },
    },
  },
}

export const error = mergeDeepRight(input, {
  boxShadow: 'none',
  outline: {
    color: danger__resting.rgba,
  },
  states: {
    focus: {
      outline: {
        color: danger__hover.rgba,
      },
    },
  },
  entities: {
    helperText: {
      typography: {
        ...typography.input.label,
        color: danger__hover.rgba,
      },
    },
  },
}) as InputToken

export const warning = mergeDeepRight(input, {
  boxShadow: 'none',
  outline: {
    color: warning__resting.rgba,
  },
  states: {
    focus: {
      outline: {
        color: warning__hover.rgba,
      },
    },
  },
  entities: {
    helperText: {
      typography: {
        ...typography.input.label,
        color: warning__hover.rgba,
      },
    },
  },
}) as InputToken

export const success = mergeDeepRight(input, {
  boxShadow: 'none',
  outline: {
    color: success__resting.rgba,
  },
  states: {
    focus: {
      outline: {
        color: success__hover.rgba,
      },
    },
  },
  entities: {
    helperText: {
      typography: {
        ...typography.input.label,
        color: success__hover.rgba,
      },
    },
  },
}) as InputToken

export const inputToken = { input, error, warning, success }
