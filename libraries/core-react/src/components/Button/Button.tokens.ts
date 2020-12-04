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

export type ButtonToken = ComponentToken & {
  entities: {
    icon: ComponentToken
  }
}

const contained: ButtonToken = {
  height: buttonHeight,
  width: '100%',
  background: primaryColor,
  typography: {
    ...buttonTypography,
    color: primaryWhite,
    textAlign: 'center',
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
      top: `${(parseInt(clicboundHeight) - parseInt(buttonHeight)) / 2}px`,
      left: '0',
    },
  },
  entities: {
    icon: {
      typography: {
        color: primaryColor,
      },
      height: '24px',
      width: '24px',
    },
  },
  states: {
    focus: {
      outline: {
        type: 'outline',
        offset: '4px',
        style: 'dashed',
        color: outline.color,
        width: outline.width,
      },
    },
    hover: {
      border: {
        type: 'border',
        width: '1px',
        color: primaryColor,
        radius: buttonBorderRadius,
      },
      background: primaryHoverColor,
    },
    disabled: {
      background: disabledColor,
      border: {
        type: 'border',
        width: '1px',
        color: disabledColor,
      },
      typography: {
        ...buttonTypography,
        color: disabledTextColor,
      },
    },
  },
}

const outlined: ButtonToken = R.mergeDeepRight(contained, {
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
    disabled: {
      background: 'transparent',
    },
  },
})

const ghost: ButtonToken = R.mergeDeepRight(contained, {
  background: 'transparent',
  typography: {
    color: primaryColor,
  },
  border: {
    width: '0',
  },

  states: {
    hover: {
      border: {
        width: '0',
      },
      typography: {
        color: primaryHoverColor,
      },
      background: primaryHoverAltColor,
    },
    disabled: {
      border: {
        width: '0',
      },
      background: 'transparent',
    },
  },
})

const ghost_icon: ButtonToken = R.mergeDeepRight(contained, {
  height: '40px',
  width: '40px',
  border: {
    width: '0',
    radius: '50%',
  },
  background: 'transparent',
  spacings: { left: '0', right: '0' },
  states: {
    hover: {
      background: primaryHoverAltColor,
      border: {
        width: '0',
        radius: '50%',
      },
    },
    disabled: {
      background: 'transparent',
      border: {
        width: '0',
      },
    },
  },
})

const secondaryContained: Partial<ButtonToken> = {
  background: secondaryColor,
  border: {
    color: secondaryColor,
  },
  entities: {
    icon: {
      typography: {
        color: secondaryColor,
      },
    },
  },
  states: {
    hover: {
      border: {
        color: secondaryHoverColor,
      },
      background: secondaryHoverColor,
    },
  },
}

const dangerContained: Partial<ButtonToken> = {
  background: dangerColor,
  border: {
    color: dangerColor,
  },
  states: {
    hover: {
      border: {
        color: dangerHoverColor,
      },
      background: dangerHoverColor,
    },
  },
}

const secondaryOutlined: Partial<ButtonToken> = {
  typography: {
    color: secondaryColor,
  },
  border: {
    color: secondaryColor,
  },
  entities: {
    icon: {
      typography: {
        color: secondaryColor,
      },
    },
  },
  states: {
    hover: {
      typography: {
        color: secondaryHoverColor,
      },
      border: {
        color: secondaryHoverColor,
      },
      background: secondaryHoverAltColor,
    },
  },
}

const secondaryGhost: Partial<ButtonToken> = R.mergeDeepRight(
  secondaryOutlined,
  {
    border: {
      width: '0',
    },
  },
)

const dangerOutlined: Partial<ButtonToken> = {
  typography: {
    color: dangerColor,
  },
  border: {
    color: dangerColor,
  },
  entities: {
    icon: {
      typography: {
        color: dangerColor,
      },
    },
  },
  states: {
    hover: {
      typography: {
        color: dangerHoverColor,
      },
      border: {
        color: dangerHoverColor,
      },
      background: dangerHoverAltColor,
    },
  },
}

const dangerGhost: Partial<ButtonToken> = R.mergeDeepRight(dangerOutlined, {
  border: {
    width: '0',
  },
})

export type ButtonTokenSet = {
  contained: ButtonToken
  outlined: ButtonToken
  ghost: ButtonToken
  ghost_icon: ButtonToken
}
type ButtonTokens = {
  primary: ButtonTokenSet
  secondary: ButtonTokenSet
  danger: ButtonTokenSet
}

export const token: ButtonTokens = {
  primary: {
    contained,
    outlined,
    ghost,
    ghost_icon,
  },
  secondary: {
    contained: R.mergeDeepRight(contained, secondaryContained),
    outlined: R.mergeDeepRight(outlined, secondaryOutlined),
    ghost: R.mergeDeepRight(ghost, secondaryGhost),
    ghost_icon: R.mergeDeepRight(ghost_icon, secondaryGhost),
  },
  danger: {
    contained: R.mergeDeepRight(contained, dangerContained),
    outlined: R.mergeDeepRight(outlined, dangerOutlined),
    ghost: R.mergeDeepRight(ghost, dangerGhost),
    ghost_icon: R.mergeDeepRight(ghost_icon, dangerGhost),
  },
}
