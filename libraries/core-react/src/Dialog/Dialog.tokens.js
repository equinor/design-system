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
  minHeight: '165px',
  background: colors.ui.background__default.hex,
  borderRadius: shape.corners,
  spacings: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: comfortable.x_small,
    bottom: comfortable.x_small,
  },
  spacingsContent: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: 0,
    bottom: 0,
  },
  spacingsTitle: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: comfortable.medium,
    bottom: comfortable.x_small,
  },
  spacingsActions: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: 0,
    bottom: comfortable.medium,
  },
  title: { text: ui.accordion_header },
  description: { text: paragraph.body_long },
  boxShadow: elevation.overlay,
}
