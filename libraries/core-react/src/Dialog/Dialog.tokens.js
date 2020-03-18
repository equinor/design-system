import { tokens } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { x_small: spacingXSmall, medium: spacingMedium },
  },
  typography: { ui, paragraph },
  elevation: { overlay: boxShadow },
  colors: {
    ui: {
      background__default: { hex: background },
    },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

export const dialog = {
  width: '252px',
  minHeight: '165px',
  background,
  borderRadius,
  spacings: {
    left: spacingMedium,
    right: spacingMedium,
    top: spacingXSmall,
    bottom: spacingXSmall,
  },
  spacingsContent: {
    left: spacingMedium,
    right: spacingMedium,
    top: 0,
    bottom: 0,
  },
  spacingsTitle: {
    left: spacingMedium,
    right: spacingMedium,
    top: spacingMedium,
    bottom: spacingXSmall,
  },
  spacingsActions: {
    left: spacingMedium,
    right: spacingMedium,
    top: 0,
    bottom: spacingMedium,
  },
  title: { text: ui.accordion_header },
  description: { text: paragraph.body_long },
  boxShadow,
}
