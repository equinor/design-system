import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

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

type SliderToken = ComponentToken

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

export const sliderOld: Slider = {
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

export const slider: SliderToken = {
  background: backgroundColorDefault,
  entities: {
    track: {
      background: backgroundColor,
      height: '4px',
      spacings: {
        top: '24px',
        bottom: '9px',
      },
      entities: {
        indicator: {
          background: indicatorColor,
          states: {
            hover: {
              background: primaryHover,
            },
          },
        },
      },
      states: {
        hover: {
          background: backgroundColorMedium,
        },
        disabled: {
          background: backgroundBorderDisabled,
        },
      },
    },
    output: {
      height: '14px',
      typography: {
        ...paragraph.overline,
        color: textColor,
      },
    },
    handle: {
      background: backgroundColorDefault,
      height: '12px',
      width: '12px',
      border: {
        type: 'border',
        color: indicatorColor,
        radius: '50%',
        width: '2px',
        style: 'solid',
      },
      states: {
        focus: {
          outline: {
            type: 'outline',
            color: focusOutlineColor,
            width: '1px',
            style: 'dashed',
            offset: '2px',
          },
        },
        hover: {
          background: primaryHoverAlt,
          border: {
            type: 'border',
            color: primaryHover,
          },
        },
      },
    },
    dot: {
      height: '6px',
      width: '6px',
      border: {
        type: 'border',
        color: backgroundColorMedium,
        width: '1px',
        style: 'solid',
        radius: '50%',
      },
      spacings: {
        bottom: '8px',
      },
    },
  },
  states: {
    disabled: {
      background: backgroundColorDisabled,
      border: {
        color: backgroundColorMedium,
      },
    },
  },
}
