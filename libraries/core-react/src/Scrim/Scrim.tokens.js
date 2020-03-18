import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__scrim: { rgba: background },
    },
  },
} = tokens

export const scrim = {
  position: 'fixed',
  zIndex: '11',
  width: '100vw',
  height: '100vh',
  background,
  top: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
}
