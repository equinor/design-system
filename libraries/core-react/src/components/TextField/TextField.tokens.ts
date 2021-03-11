import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors,
  typography,
  spacings: { comfortable },
} = tokens

export const textfield: ComponentToken = {
  border: {
    type: 'border',
    radius: 0,
    width: '1px',
    color: colors.interactive.primary__resting.hex,
  },
  spacings: {
    left: comfortable.small,
    right: comfortable.small,
    top: '0px',
  },
  states: {
    focus: {
      outline: {
        width: '2px',
        color: colors.interactive.primary__resting.hex,
        style: 'solid',
        type: 'outline',
        offset: '0px',
      },
    },
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

export const error: ComponentToken = {
  border: {
    type: 'border',
    radius: 0,
    width: '1px',
    color: colors.interactive.danger__resting.hex,
  },
  states: {
    focus: {
      outline: {
        width: '2px',
        color: colors.interactive.danger__hover.hex,
        style: 'solid',
        type: 'outline',
        offset: '0px',
      },
    },
  },
}
export const warning: ComponentToken = {
  border: {
    type: 'border',
    radius: 0,
    width: '1px',
    color: colors.interactive.warning__resting.hex,
  },
  states: {
    focus: {
      outline: {
        width: '2px',
        color: colors.interactive.warning__hover.hex,
        style: 'solid',
        type: 'outline',
        offset: '0px',
      },
    },
  },
}
export const success: ComponentToken = {
  border: {
    type: 'border',
    radius: 0,
    width: '1px',
    color: colors.interactive.success__resting.hex,
  },
  states: {
    focus: {
      outline: {
        width: '2px',
        color: colors.interactive.success__hover.hex,
        style: 'solid',
        type: 'outline',
        offset: '0px',
      },
    },
  },
}
