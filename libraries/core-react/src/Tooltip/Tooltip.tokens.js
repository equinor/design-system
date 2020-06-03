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
  tooltip: {
    minHeight: '32px',
  },
  arrow: {
    width: '8px',
    height: '8px',
  },
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
      arrowTop: '-5px',
      tooltipBottom: '-40px',
      arrowTransform: 'rotate(90deg)',
    },
    bottomRight: {
      arrowRight: '4px',
      arrowTop: '-5px',
      tooltipRight: 0,
      tooltipBottom: '-40px',
      arrowTransform: 'rotate(90deg)',
    },
    bottomLeft: {
      arrowLeft: '4px',
      arrowTop: '-5px',
      tooltipLeft: 0,
      tooltipBottom: '-40px',
      arrowTransform: 'rotate(90deg)',
    },
    top: {
      width: '100%',
      arrowLeft: 'calc(50% - 8px/2)',
      arrowBottom: '-5px',
      tooltipTop: '-40px',
      arrowTransform: 'rotate(-90deg)',
    },
    topRight: {
      arrowRight: '4px',
      arrowBottom: '-5px',
      tooltipRight: 0,
      width: 'auto',
      tooltipTop: '-40px',
      arrowTransform: 'rotate(-90deg)',
    },
    topLeft: {
      arrowLeft: '4px',
      arrowBottom: '-5px',
      tooltipLeft: 0,
      tooltipTop: '-40px',
      arrowTransform: 'rotate(-90deg)',
    },
    left: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowRight: '-5px',
      tooltipLeft: '-8px',
      tooltipTop: 'calc(50% - 32px/2)',
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(180deg)',
    },
    leftTop: {
      arrowTop: '4px',
      arrowRight: '-5px',
      tooltipLeft: '-8px',
      tooltipTop: 0,
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(180deg)',
    },
    leftBottom: {
      arrowBottom: '4px',
      arrowRight: '-5px',
      tooltipLeft: '-8px',
      tooltipBottom: 0,
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(180deg)',
    },
    right: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowLeft: '-5px',
      tooltipRight: '-8px',
      tooltipTop: 'calc(50% - 32px/2)',
      transform: 'translateX(100%)',
    },
    rightTop: {
      arrowTop: '4px',
      arrowLeft: '-5px',
      tooltipRight: '-8px',
      tooltipTop: 0,
      transform: 'translateX(100%)',
    },
    rightBottom: {
      arrowBottom: '4px',
      arrowLeft: '-5px',
      tooltipRight: '-8px',
      tooltipBottom: 0,
      transform: 'translateX(100%)',
    },
  },
}
