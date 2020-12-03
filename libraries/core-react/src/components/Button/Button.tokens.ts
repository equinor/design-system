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
import * as R from 'ramda'

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
      secondary__resting: { rgba: secondaryColor },
      secondary__link_hover: { rgba: secondaryHoverColor },
      secondary__highlight: { rgba: secondaryHoverAltColor },
      danger__resting: { rgba: dangerColor },
      danger__hover: { rgba: dangerHoverColor },
      danger__highlight: { rgba: dangerHoverAltColor },
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

const outlined: ComponentToken = R.mergeDeepRight(contained, {
  background: 'transparent',
  typography: {
    color: primaryColor,
  },
  states: {
    hover: {
      typography: {
        color: primaryHoverColor,
      },
      background: primaryHoverAltColor,
      border: {
        color: primaryHoverColor,
      },
    },
  },
})

const ghost: ComponentToken = R.mergeDeepRight(contained, {
  background: 'transparent',
  typography: {
    color: primaryColor,
  },
  border: {
    type: 'border',
    color: 'transparent',
  },
  states: {
    hover: {
      typography: {
        color: primaryHoverColor,
      },
      background: primaryHoverAltColor,
    },
  },
})

const secondaryContained: Partial<ComponentToken> = {
  background: secondaryColor,
  border: {
    color: secondaryColor,
  },
  states: {
    hover: {
      background: secondaryHoverColor,
    },
  },
}

const dangerContained: Partial<ComponentToken> = {
  background: dangerColor,
  border: {
    color: dangerColor,
  },
  states: {
    hover: {
      background: dangerHoverColor,
    },
  },
}

const secondarOutlinedGhost: Partial<ComponentToken> = {
  border: {
    color: secondaryColor,
  },
  states: {
    hover: {
      border: {
        color: secondaryHoverColor,
      },
      background: secondaryHoverAltColor,
    },
  },
}

const dangerOutlinedGhost: Partial<ComponentToken> = {
  states: {
    hover: {
      background: dangerHoverAltColor,
    },
  },
}

const buttonTokens = {
  primary: {
    contained,
    outlined,
    ghost,
  },
  secondary: {
    contained: R.mergeDeepRight(contained, secondaryContained),
    outlined: R.mergeDeepRight(outlined, secondarOutlinedGhost),
    ghost: R.mergeDeepRight(ghost, secondarOutlinedGhost),
  },
  danger: {
    contained: R.mergeDeepRight(contained, dangerContained),
    outlined: R.mergeDeepRight(outlined, dangerOutlinedGhost),
    ghost: R.mergeDeepRight(ghost, dangerOutlinedGhost),
  },
}

console.log('button tokens', buttonTokens)

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

export const oldButtoneToken: {
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
