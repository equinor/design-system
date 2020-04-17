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
  },
} = tokens

export const tooltip = {
  typography: {
    color: '#fff',
    fontFamily: 'Equinor',
    fontSize: '12px',
    lineHeight: '16px',
  },
  background,
  spacings: {
    left: spacingSmall,
    right: spacingSmall,
    top: spacingSmall,
    bottom: spacingSmall,
  },
  borderRadius,
  placement: {
    bottom: {
      width: '100%',
      arrowLeft: 'calc(50% - 8px/2)',
      arrowTop: '-4px',
      margin: '0 auto',
    },
    bottomRight: {
      arrowRight: 'calc(6px + 8px/2)',
      arrowTop: '-4px',
      right: 0,
      width: 'auto',
    },
    bottomLeft: {
      arrowLeft: '6px',
      arrowTop: '-4px',
      margin: 0,
    },
    top: {
      width: '100%',
      arrowLeft: 'calc(50% - 8px/2)',
      arrowTop: '-4px',
      margin: '0 auto',
    },
    topRight: {
      arrowRight: 'calc(6px + 8px/2)',
      arrowTop: '-4px',
      right: 0,
      width: 'auto',
    },
    topLeft: {
      arrowLeft: '6px',
      arrowTop: '-4px',
      margin: 0,
    },
  },
}
