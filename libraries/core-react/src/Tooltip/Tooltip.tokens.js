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
      arrowLeft: 'calc(50% - 8px/2)',
      arrowTop: '-8px',
      tooltipBottom: '-40px',
      arrowTransform: 'rotate(180deg)',
    },
    bottomRight: {
      arrowRight: '4px',
      arrowTop: '-8px',
      tooltipRight: 0,
      tooltipBottom: '-40px',
      arrowTransform: 'rotate(180deg)',
    },
    bottomLeft: {
      arrowLeft: '4px',
      arrowTop: '-8px',
      tooltipLeft: 0,
      tooltipBottom: '-40px',
      arrowTransform: 'rotate(180deg)',
    },
    top: {
      width: '100%',
      arrowLeft: 'calc(50% - 8px/2)',
      arrowBottom: '-8px',
      tooltipTop: '-40px',
    },
    topRight: {
      arrowRight: '4px',
      arrowBottom: '-8px',
      tooltipRight: 0,
      width: 'auto',
      tooltipTop: '-40px',
    },
    topLeft: {
      arrowLeft: '4px',
      arrowBottom: '-8px',
      margin: 0,
      tooltipLeft: 0,
      tooltipTop: '-40px',
    },
    left: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowRight: '-8px',
      tooltipLeft: '-10px',
      tooltipTop: 'calc(50% - 32px/2)',
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(-90deg)',
    },
    leftTop: {
      arrowTop: '4px',
      arrowRight: '-8px',
      tooltipLeft: '-10px',
      tooltipTop: 0,
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(-90deg)',
    },
    leftBottom: {
      arrowBottom: '4px',
      arrowRight: '-8px',
      tooltipLeft: '-10px',
      tooltipBottom: 0,
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(-90deg)',
    },
    right: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowLeft: '-8px',
      tooltipRight: '-10px',
      tooltipTop: 'calc(50% - 32px/2)',
      transform: 'translateX(100%)',
      arrowTransform: 'rotate(90deg)',
    },
    rightTop: {
      arrowTop: '4px',
      arrowLeft: '-8px',
      tooltipRight: '-10px',
      tooltipTop: 0,
      transform: 'translateX(100%)',
      arrowTransform: 'rotate(90deg)',
    },
    rightBottom: {
      arrowBottom: '4px',
      arrowLeft: '-8px',
      tooltipRight: '-10px',
      tooltipBottom: 0,
      transform: 'translateX(100%)',
      arrowTransform: 'rotate(90deg)',
    },
  },
}
