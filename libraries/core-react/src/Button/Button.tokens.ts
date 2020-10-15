import primary from '@equinor/eds-tokens/components/button/buttons-primary.json'
import secondary from '@equinor/eds-tokens/components/button/buttons-secondary.json'
import danger from '@equinor/eds-tokens/components/button/buttons-danger.json'
import disabled from '@equinor/eds-tokens/components/button/buttons-disabled.json'
import type {
  Border,
  Focus,
  Hover,
  Spacing,
  Typography,
} from '@equinor/eds-tokens'

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

export type Button = {
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
    [P2 in keyof typeof colors[P]]: Button
  }
}

export type ButtonGroups =
  | Buttons['primary']
  | Buttons['secondary']
  | Buttons['danger']
  | Buttons['disabled']

export const button: {
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
