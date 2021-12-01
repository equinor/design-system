import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: background },
    },
    interactive: {
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__resting: { rgba: primaryColor },
    },
    text: {
      static_icons__tertiary: { rgba: placeholderColor },
    },
  },
  spacings: {
    comfortable: { small },
  },
  typography: {
    input: { text: typography },
  },
} = tokens

type SearchToken = ComponentToken

export const search: SearchToken = {
  background,
  typography,
  height: '36px',
  clickbound: {
    offset: { top: '6px' },
    height: '48px',
  },
  spacings: {
    left: small,
    right: small,
    top: '6px',
    bottom: '6px',
  },
  border: {
    type: 'border',
    width: '1px',
    style: 'solid',
    color: 'transparent',
  },
  states: {
    focus: {
      border: {
        type: 'border',
        width: '1px',
        style: 'solid',
        color: primaryColor,
      },
    },
  },
  entities: {
    placeholder: {
      typography: {
        color: placeholderColor,
      },
    },
    icon: {
      typography: {
        color: placeholderColor,
      },
      border: {
        type: 'border',
        radius: '50%',
      },
      states: {
        hover: {
          background: primaryHoverAlt,
        },
      },
      clickbound: {
        offset: { top: '6px' },
        height: '36px',
      },
    },
    button: {
      height: '24px',
      width: '24px',
      spacings: {
        right: small,
      },
    },
  },
}
