import { tokens } from '@equinor/eds-tokens'
import type {
  Border,
  Focus,
  Hover,
  Spacing,
  Outline,
  Typography,
  ComponentToken,
} from '@equinor/eds-tokens'

const {
  components: {
    button: { primary, secondary, danger, disabled },
  },
  typography: {
    navigation: { button: buttonTypography },
  },
  colors: {
    text: {
      static_icons__primary_white: { rgba: primaryWhite },
    },
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover: { rgba: primaryHoverColor },
      primary__hover_alt: { rgba: primaryHoverAltColor },
      disabled__text: { rgba: disabledTextColor },
      disabled__border: { rgba: disabledBorderColor },
      disabled__fill: { rgba: disabledColor },
    },
  },
  spacings: {
    comfortable: { medium },
  },
  shape: {
    button: { minHeight: buttonHeight, borderRadius: buttonBorderRadius },
  },
  interactions: { focused: outline },
  clickbounds: { default__base: clicboundHeight },
} = tokens

const buttonOutline: Outline = {
  type: 'outline',
  offset: '4px',
  style: 'dashed',
  color: outline.color,
  width: outline.width,
}

const contained: ComponentToken = {
  height: buttonHeight,
  background: primaryColor,
  typography: {
    ...buttonTypography,
    color: primaryWhite,
  },
  border: {
    type: 'border',
    width: '1px',
    color: primaryColor,
    radius: buttonBorderRadius,
  },
  spacings: {
    left: medium,
    right: medium,
  },
  clickbound: {
    height: clicboundHeight,
    width: '100%',
    offset: {
      top: (parseInt(clicboundHeight) - parseInt(buttonHeight)) / 2,
      left: 0,
    },
  },
  states: {
    focus: {
      outline: buttonOutline,
    },
    hover: {
      background: primaryHoverColor,
    },
    disabled: {
      background: disabledColor,
      border: {
        type: 'border',
        color: disabledBorderColor,
      },
      typography: {
        ...buttonTypography,
        color: disabledTextColor,
      },
    },
  },
}

const outlined: ComponentToken = {
  ...contained,
  background: 'transparent',
  typography: {
    ...buttonTypography,
    color: primaryColor,
  },
  states: {
    hover: {
      typography: {
        ...buttonTypography,
        color: primaryHoverColor,
      },
      background: primaryHoverAltColor,
      border: {
        ...contained.border,
        type: 'border',
        color: primaryHoverColor,
      },
    },
  },
}
const ghost: ComponentToken = {
  ...contained,
  background: 'transparent',
  typography: {
    ...buttonTypography,
    color: primaryColor,
  },
  border: {
    ...contained.border,
    type: 'border',
    color: 'transparent',
  },
  states: {
    hover: {
      typography: {
        ...buttonTypography,
        color: primaryHoverColor,
      },
      background: primaryHoverAltColor,
    },
  },
}

const colors = {
  primary: {
    ...primary,
    ghost_icon: {
      ...primary.ghost_icon,
      typography: primary.ghost.typography,
    },
  },
  secondary: {
    ...secondary,
    ghost_icon: {
      ...secondary.ghost_icon,
      typography: secondary.ghost.typography,
    },
  },
  danger: {
    ...danger,
    ghost_icon: {
      ...danger.ghost_icon,
      typography: danger.ghost.typography,
    },
  },
  disabled: {
    ...disabled,
    ghost_icon: {
      ...disabled.ghost_icon,
      typography: disabled.ghost.typography,
    },
  },
}

export type Button_ = {
  height: string
  width?: string
  background: string
  color: string
  border: Border
  typography: Typography
  spacing?: Partial<Spacing>
  focus?: Focus
  hover?: Hover
  // TODO Remove these once figma-broker is updated with proper types
  pressedColor?: string
  clickboundOffset?: number | string
  clickbound?: string
}

type Buttons = {
  [P in keyof typeof colors]: {
    [P2 in keyof typeof colors[P]]: Button_
  }
}

export type ButtonGroups =
  | Buttons['primary']
  | Buttons['secondary']
  | Buttons['danger']
  | Buttons['disabled']

export const button_: {
  colors: Buttons
  icon_size: {
    width: string
    height: string
  }
} = {
  colors,
  icon_size: {
    width: '24px',
    height: '24px',
  },
}
