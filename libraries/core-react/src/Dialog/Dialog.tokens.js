import { tokens } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  typography: { ui, paragraph },
  elevation: { overlay: boxShadow },
  colors: {
    ui: {
      background__default: { rgba: background },
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
  spacingsMedium: spacingMedium,
  title: { typography: ui.accordion_header },
  description: { typography: paragraph.body_long },
  boxShadow,
}
