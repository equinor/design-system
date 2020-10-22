import { tokens } from '@equinor/eds-tokens'
import type { Typography } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: backgroundColor },
      background__default: { rgba: backgroundColorDefault },
      background__medium: { rgba: backgroundColorMedium },
    },
    interactive: {
      primary__resting: { rgba: indicatorColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      focus: { rgba: focusOutlineColor },
      disabled__fill: { rgba: backgroundColorDisabled },
      disabled__border: { rgba: backgroundBorderDisabled },
    },
    text: {
      static_icons__tertiary: { rgba: textColor },
    },
  },
  typography: { paragraph },
} = tokens

type Slider = {
  enabled: {
    background: string
    track: {
      background: string
      height: string
      realHeight: string
      bottomOffset: string
      indicator: {
        color: string
        hover: {
          color: string
        }
      }
      hover: {
        background: string
      }
    }
    output: {
      height: string
      typography: Typography
      text: string
    }
    handle: {
      background: string
      size: string
      border: {
        color: string
        radius: string
        width: string
        type: string
      }
      outline: string
      outlineOffset: string
      hover: {
        background: string
        border: {
          color: string
        }
      }
    }
    dot: {
      size: string
      border: {
        color: string
        width: string
        type: string
        radius: string
      }
    }
  }
  disabled: {
    background: string
    border: {
      color: string
    }
    track: {
      indicator: {
        color: string
      }
    }
  }
}

export const slider: Slider = {
  enabled: {
    background: backgroundColorDefault,
    track: {
      background: backgroundColor,
      height: '4px',
      realHeight: '24px',
      bottomOffset: '9px',
      indicator: {
        color: indicatorColor,
        hover: {
          color: primaryHover,
        },
      },
      hover: {
        background: backgroundColorMedium,
      },
    },
    output: {
      height: '14px',
      typography: paragraph.overline,
      text: textColor,
    },
    handle: {
      background: backgroundColorDefault,
      size: '12px',
      border: {
        color: indicatorColor,
        radius: '50%',
        width: '2px',
        type: 'solid',
      },
      outline: `1px dashed ${focusOutlineColor}`,
      outlineOffset: '2px',
      hover: {
        background: primaryHoverAlt,
        border: {
          color: primaryHover,
        },
      },
    },
    dot: {
      size: '6px',
      border: {
        color: backgroundColorMedium,
        width: '1px',
        type: 'solid',
        radius: '50%',
      },
    },
  },
  disabled: {
    background: backgroundColorDisabled,
    border: {
      color: backgroundColorMedium,
    },
    track: {
      indicator: {
        color: backgroundBorderDisabled,
      },
    },
  },
}
