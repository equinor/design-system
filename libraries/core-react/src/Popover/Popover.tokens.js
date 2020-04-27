import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: background },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall, medium: spacingMedium },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

export const popover = {
  typography: {
    color: '#fff',
    fontFamily: 'Equinor',
    fontSize: '12px',
    lineHeight: '16px',
  },
  background,
  popover: {
    minHeight: '32px',
  },
  arrow: {
    width: '8px',
    height: '8px',
  },
  spacings: {
    top: '12px',
    left: spacingMedium,
    right: spacingMedium,
    bottom: spacingMedium,
  },
  borderRadius,
  placement: {
    bottom: {
      arrowLeft: 'calc(50% - 8px/2)',
      arrowTop: '-5px',
      popoverBottom: '-8px',
      arrowTransform: 'rotate(90deg)',
      transform: 'translateY(100%)',
    },
    bottomRight: {
      arrowRight: '4px',
      arrowTop: '-5px',
      popoverRight: 0,
      popoverBottom: '-8px',
      arrowTransform: 'rotate(90deg)',
      transform: 'translateY(100%)',
    },
    bottomLeft: {
      arrowLeft: '4px',
      arrowTop: '-5px',
      popoverLeft: 0,
      popoverBottom: '-8px',
      arrowTransform: 'rotate(90deg)',
      transform: 'translateY(100%)',
    },
    top: {
      width: '100%',
      arrowLeft: 'calc(50% - 8px/2)',
      arrowBottom: '-5px',
      popoverTop: '-8px',
      arrowTransform: 'rotate(-90deg)',
      transform: 'translateY(-100%)',
    },
    topRight: {
      arrowRight: '4px',
      arrowBottom: '-5px',
      popoverRight: 0,
      width: 'auto',
      popoverTop: '-8px',
      arrowTransform: 'rotate(-90deg)',
      transform: 'translateY(-100%)',
    },
    topLeft: {
      arrowLeft: '4px',
      arrowBottom: '-5px',
      popoverLeft: 0,
      popoverTop: '-8px',
      arrowTransform: 'rotate(-90deg)',
      transform: 'translateY(-100%)',
    },
    left: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowRight: '-5px',
      popoverLeft: '-8px',
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(180deg)',
    },
    leftTop: {
      arrowTop: '4px',
      arrowRight: '-5px',
      popoverLeft: '-8px',
      popoverTop: 0,
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(180deg)',
    },
    leftBottom: {
      arrowBottom: '4px',
      arrowRight: '-5px',
      popoverLeft: '-8px',
      popoverBottom: 0,
      transform: 'translateX(-100%)',
      arrowTransform: 'rotate(180deg)',
    },
    right: {
      arrowTop: 'calc(50% - 8px/2)',
      arrowLeft: '-5px',
      popoverRight: '-8px',
      transform: 'translateX(100%)',
    },
    rightTop: {
      arrowTop: '4px',
      arrowLeft: '-5px',
      popoverRight: '-8px',
      popoverTop: 0,
      transform: 'translateX(100%)',
    },
    rightBottom: {
      arrowBottom: '4px',
      arrowLeft: '-5px',
      popoverRight: '-8px',
      popoverBottom: 0,
      transform: 'translateX(100%)',
    },
  },
}
