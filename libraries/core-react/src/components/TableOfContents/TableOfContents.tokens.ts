import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      focus: { rgba: focusColor },
    },
    text: {
      static_icons__tertiary: { rgba: labelColor },
    },
  },
  shape: {
    corners: { borderRadius },
  },
  spacings: {
    comfortable: { small, x_large, xxx_large },
  },
  typography: {
    paragraph: {
      caption: { fontSize, lineHeight },
    },
  },
} = tokens

type TableOfContentsType = ComponentToken

export const tableOfContents: TableOfContentsType = {
  entities: {
    icon: {
      background: primaryColor,
      spacings: {
        right: small,
      },
    },
    links: {
      width: 'calc(189px - 36px)',
      typography: {
        fontSize,
        lineHeight,
      },
      spacings: {
        top: '10px',
        bottom: '10px',
        left: '18px',
        right: '18px',
      },
    },
    span: {
      maxWidth: '115px',
    },
    sticky: {
      spacings: {
        top: x_large,
        right: x_large,
      },
    },
  },
  states: {
    focus: {
      outline: {
        type: 'outline',
        color: focusColor,
        width: '1px',
        style: 'dashed',
        offset: '2px',
      },
    },
    hover: {
      background: primaryHoverAlt,
      border: {
        radius: borderRadius,
      },
      entities: {
        icon: {
          background: primaryHover,
        },
      },
      typography: {
        color: primaryHover,
      },
    },
  },
  typography: { color: labelColor },
  spacings: {
    top: xxx_large,
    bottom: x_large,
  },
}
