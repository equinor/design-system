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
      static_icons__primary_white: { rgba: color },
    },
    interactive: {
      link_in_snackbars: { rgba: buttonColor },
    },
  },
  spacings: {
    comfortable: { medium: spacingMedium, x_large: spacingXLarge },
  },
  clickbounds: { default__base: clickbounds },
  shape: {
    button: { borderRadius: radius },
  },
  shape,
} = tokens

type Snackbar = ComponentToken

export const snackbar: Snackbar = {
  background,
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
        top: '-10px',
        bottom: '-10px',
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
  modes: {
    compact: {
      height: shape._modes.compact.straight.minHeight,
    },
  },
}
