import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    ui: { accordion_header: typography },
  },
  colors: {
    ui: {
      background__default: { rgba: backgroundDefault },
      background__medium: { rgba: borderColor },
      background__light: { rgba: backgroundHover },
    },

    interactive: {
      primary__resting: { rgba: activatedColor },
      disabled__fill: { rgba: disabledIconColor },
      disabled__text: { rgba: disabledColor },
      focus: { rgba: focusOutlineColor },
    },
    text: {
      static_icons__default: { rgba: defaultIconColor },
    },
  },
  spacings: {
    comfortable: { medium: mediumSpacing },
  },
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens

type AccordionToken = ComponentToken & {
  entities: {
    chevron: ComponentToken
    header: ComponentToken
    icon: ComponentToken
  }
}

export const accordion: AccordionToken = {
  border: {
    type: 'border',
    color: borderColor,
    style: 'solid',
    width: '1px',
  },
  entities: {
    chevron: {
      background: activatedColor,
      states: {
        disabled: { background: disabledIconColor },
      },
    },
    header: {
      height: '48px',
      background: backgroundDefault,
      typography,
      spacings: {
        left: mediumSpacing,
        right: mediumSpacing,
      },

      states: {
        focus: {
          outline: {
            type: 'outline',
            color: focusOutlineColor,
            style: 'dashed',
            width: focusOutlineWidth,
            offset: '2px',
          },
        },
        disabled: {
          typography: {
            ...typography,
            color: disabledColor,
          },
        },
        active: {
          typography: {
            ...typography,
            color: activatedColor,
          },
        },
        hover: {
          background: backgroundHover,
        },
      },
    },
    panel: {
      spacings: {
        bottom: mediumSpacing,
        left: mediumSpacing,
        right: mediumSpacing,
        top: mediumSpacing,
      },
    },
    icon: {
      typography: {
        color: defaultIconColor,
      },
    },
  },
  modes: {
    compact: {},
  },
}
