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
      tooltipBottom: '-40px',
    },
    bottomRight: {
      arrowRight: 'calc(6px + 8px/2)',
      arrowTop: '-4px',
      tooltipRight: 0,
      width: 'auto',
      tooltipBottom: '-40px',
    },
    bottomLeft: {
      arrowLeft: '6px',
      arrowTop: '-4px',
      margin: 0,
      tooltipBottom: '-40px',
    },
    top: {
      width: '100%',
      arrowLeft: 'calc(50% - 8px/2)',
      arrowBottom: '-4px',
      margin: '0 auto',
      tooltipTop: '-40px',
    },
    topRight: {
      arrowRight: 'calc(6px + 8px/2)',
      arrowBottom: '-4px',
      tooltipRight: 0,
      width: 'auto',
      tooltipTop: '-40px',
    },
    topLeft: {
      arrowLeft: '6px',
      arrowBottom: '-4px',
      margin: 0,
      tooltipTop: '-40px',
    },
    left: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowRight: '-4px',
      tooltipLeft: '-10px',
      tooltipTop: 'calc(50% - 32px/2)',
      transform: 'translateX(-100%)',
    },
    leftTop: {
      arrowTop: '6px',
      arrowRight: '-4px',
      tooltipLeft: '-10px',
      tooltipTop: 0,
      transform: 'translateX(-100%)',
    },
    leftBottom: {
      arrowBottom: '6px',
      arrowRight: '-4px',
      tooltipLeft: '-10px',
      tooltipBottom: 0,
      transform: 'translateX(-100%)',
    },
    right: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowLeft: '-4px',
      tooltipRight: '-10px',
      tooltipTop: 'calc(50% - 32px/2)',
      transform: 'translateX(100%)',
    },
    rightTop: {
      arrowTop: '6px',
      arrowLeft: '-4px',
      tooltipRight: '-10px',
      tooltipTop: 0,
      transform: 'translateX(100%)',
    },
    rightBottom: {
      arrowBottom: '6px',
      arrowLeft: '-4px',
      tooltipRight: '-10px',
      tooltipBottom: 0,
      transform: 'translateX(100%)',
    },
  },
}
