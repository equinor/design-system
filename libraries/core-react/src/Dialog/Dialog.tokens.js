import { tokens } from '@equinor/eds-tokens'

const {
  spacings: { comfortable },
  typography: { ui },
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
  title: { text: ui.accordion_header },
  boxShadow: elevation.overlay,
}
