import { tokens } from '@equinor/eds-tokens'

const {
  spacings: { comfortable },
  typography: { ui, paragraph },
  elevation,
  colors,
  shape,
} = tokens

export const dialog = {
  width: '252px',
  height: '165px',
  background: colors.ui.background__default.hex,
  borderRadius: shape.corners,
  spacings: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: comfortable.small,
    bottom: comfortable.small,
  },
  spacingsContent: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: 0,
    bottom: 0,
  },
  title: { text: ui.accordion_header },
  description: { text: paragraph.body_long },
  boxShadow: elevation.overlay,
}
