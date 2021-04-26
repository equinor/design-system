import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { medium: spacingMedium },
  },
  typography: {
    ui: { accordion_header },
    paragraph: { body_long },
  },
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

type DialogToken = ComponentToken

export const dialog: DialogToken = {
  width: '252px',
  background,
  typography: accordion_header,
  border: {
    type: 'border',
    radius: borderRadius,
  },
  spacings: {
    top: spacingMedium,
  },
  entities: {
    children: {
      spacings: {
        top: '0px',
        bottom: spacingMedium,
        left: spacingMedium,
        right: spacingMedium,
      },
    },
    title: {
      minHeight: '24px',
      height: '8px',
      typography: accordion_header,
    },
    content: {
      minHeight: '80px',
      height: '104px',
      typography: body_long,
    },
    actions: {
      minHeight: '48px',
      height: '8px',
    },
  },
}
