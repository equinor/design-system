import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

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
    comfortable: { medium: spacingMedium, x_large: spacingXLarge },
  },
  elevation: { overlay: boxShadow },
  clickbounds: { default__base: clickbounds },
  shape: {
    button: { borderRadius: radius },
  },
} = tokens

type Snackbar = ComponentToken & {
  boxShadow: string
}

export const snackbar: Snackbar = {
  background,
  boxShadow,
  minHeight: clickbounds,
  border: {
    type: 'border',
    width: 0,
    radius,
  },
  entities: {
    actions: {
      spacings: {
        left: spacingXLarge,
        top: '10px',
        bottom: '10px',
      },
    },
    button: {
      typography: { color: buttonColor },
    },
  },
  spacings: {
    left: spacingMedium,
    bottom: spacingMedium,
    right: spacingMedium,
    top: spacingMedium,
  },
  typography: {
    ...typography,
    color,
  },
}
