import { tokens } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  typography: {
    ui: { accordion_header },
    paragraph: { body_long },
  },
  elevation: { above_scrim: boxShadow },
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

type Typography = {
  color: string
  fontFamily: string
  fontSize: string
  fontWeight: number
  lineHeight: string
  textAlign: string
}

type Dialog = {
  width: string
  minHeight: string
  background: string
  borderRadius: string
  spacingsMedium: string
  title: Typography
  description: Typography
  boxShadow: string
}

export const dialog: Dialog = {
  width: '252px',
  minHeight: '165px',
  background,
  borderRadius,
  spacingsMedium: spacingMedium,
  title: accordion_header,
  description: body_long,
  boxShadow,
}
