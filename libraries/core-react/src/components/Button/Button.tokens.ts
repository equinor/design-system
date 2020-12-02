import { tokens } from '@equinor/eds-tokens'
import type {
  Border,
  Focus,
  Hover,
  Spacing,
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
      static_icons__primary_white: { rgba: typographyColor },
    },
    ui: {
      background__medium: { rgba: borderColor },
    },
    interactive: {
      primary__resting: { rgba: containedBackgroundColor },
      table__cell__fill_hover: { rgba: hoverBackgroundColor },
      table__cell__fill_activated: { rgba: activeBackgroundColor },
      danger__highlight: { rgba: errorColor },
      primary__resting: { rgba: primaryRestingColor },
      disabled__text: { rgba: disabledTextColor },
      disabled__border: { rgba: disabledBorderColor },
      focus: { rgba: focusColor },
    },
  },
  spacings: {
    comfortable: { medium },
  },
  shape: { button: buttonShape },
  interactions: { focused: outline },
} = tokens

const button: ComponentToken = {
  height: buttonShape.minHeight,
  background: containedBackgroundColor,
  typography: {
    ...buttonTypography,
    color: typographyColor,
  },
  border: {
    type: 'border',
    width: '1px',
    color: containedBackgroundColor,
    radius: buttonShape.borderRadius,
  },
  spacings: {
    left: medium,
    right: medium,
  },
  outline: {
    type: 'outline',
    offset: '4px',
    style: 'dashed',
    color: outline.color,
    width: outline.width,
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
