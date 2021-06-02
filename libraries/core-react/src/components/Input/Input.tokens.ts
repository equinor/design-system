import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

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

export type InputToken = ComponentToken

export type InputVariantsToken = {
  default: ComponentToken
  error: ComponentToken
  warning: ComponentToken
  success: ComponentToken
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
  },
  states: {
    disabled: {
      typography: {
        color: disabled__text.rgba,
      },
    },
  },
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

export const inputVariants: InputVariantsToken = {
  default: {
    boxShadow: 'inset 0px -1px 0px 0px ' + static_icons__tertiary.rgba,
    states: {
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
  },
  error: {
    boxShadow: 'inset 0px -1px 0px 0px transparent',
    states: {
      active: {
        outline: {
          type: 'outline',
          color: danger__resting.rgba,
          width: '1px',
          style: 'solid',
          offset: '0px',
        },
      },
      focus: {
        outline: {
          type: 'outline',
          width: '2px',
          color: danger__hover.rgba,
          style: 'solid',
          offset: '0px',
        },
      },
    },
  },
  warning: {
    boxShadow: 'inset 0px -1px 0px 0px transparent',
    states: {
      active: {
        outline: {
          type: 'outline',
          color: warning__resting.rgba,
          width: '1px',
          style: 'solid',
          offset: '0px',
        },
      },
      focus: {
        outline: {
          type: 'outline',
          width: '2px',
          color: warning__hover.rgba,
          style: 'solid',
          offset: '0px',
        },
      },
    },
  },
  success: {
    boxShadow: 'inset 0px -1px 0px 0px transparent',
    states: {
      active: {
        outline: {
          type: 'outline',
          color: success__resting.rgba,
          width: '1px',
          style: 'solid',
          offset: '0px',
        },
      },
      focus: {
        outline: {
          type: 'outline',
          width: '2px',
          color: success__hover.rgba,
          style: 'solid',
          offset: '0px',
        },
      },
    },
  },
}
