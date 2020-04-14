import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__overlay: { rgba: background },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall },
  },
  shape: {
    corners: { borderRadius },
    caret: { minHeight, minWidth },
  },
  typography: {
    ui: { tooltip: tooltipUi },
  },
} = tokens

export const tooltip = {
  ...tooltipUi,
  background,
  spacings: {
    left: spacingSmall,
    right: spacingSmall,
    top: spacingSmall,
    bottom: spacingSmall,
  },
  borderRadius,
}
