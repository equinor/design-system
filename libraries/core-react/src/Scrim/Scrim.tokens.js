import { tokens } from '@equinor/eds-tokens'

const { colors } = tokens

export const scrim = {
  position: 'fixed',
  zIndex: '1',
  width: '100vw',
  height: '100vh',
  background: colors.ui.background__scrim.rgba,
}
