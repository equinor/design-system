import { tokens } from '@equinor/eds-tokens'
import type { Typography, ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    ui: { snackbar: typography },
  },
  colors: {
    ui: {
      background__overlay: { rgba: background },
    },
    text: {
      static_icons__primary_white: { hex: color },
    },
    interactive: {
      link_in_snackbars: { hex: buttonColor },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  elevation: { overlay: boxShadow },
  clickbounds: { default__base: clickbounds },
  shape: {
    button: { borderRadius: radius },
  },
} = tokens

type Snackbar = ComponentToken & {
  boxShadow: string
  minHeight: string // TODO
}

export const snackbar: Snackbar = {
  background,
  boxShadow,
  minHeight: clickbounds, // TODO
  border: {
    type: 'border',
    width: 0,
    radius,
  },
  spacings: {
    left: spacingMedium,
    bottom: spacingMedium,
    padding: spacingMedium,
    actionSpace: '32px',
  },
  typography: {
    ...typography,
    color,
  },
  entities: {
    button: {
      color: buttonColor,
    }
  }
  buttonColor,
}
