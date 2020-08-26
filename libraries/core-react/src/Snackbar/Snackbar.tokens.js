// @ts-nocheck
import { tokens } from '@equinor/eds-tokens'

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
  },
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  elevation: { overlay: boxShadow },
  clickbounds: { default__base: clickbounds },
} = tokens

export const snackbar = {
  background,
  boxShadow,
  minHeight: clickbounds,
  spacings: {
    left: spacingMedium,
    bottom: spacingMedium,
    padding: spacingMedium,
    actionSpace: '32px',
  },
  text: {
    color,
    typography: {
      ...typography,
    },
  },
  borderRadius: '4px',
}
