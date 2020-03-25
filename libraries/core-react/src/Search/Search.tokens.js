import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__light: { rgba: background },
    },
    interactive: {
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__resting: { rgba: primaryColor },
    },
    text: {
      static_icons__tertiary: { rgba: placeholderColor },
    },
  },
  spacings: {
    comfortable: { small },
  },
  typography: {
    input: { text: typography },
  },
} = tokens

export const search = {
  enabled: {
    background,
    typography,
    placeholder: {
      color: placeholderColor,
    },
    height: '36px',
    clickbounds: {
      offset: '6px',
      height: '48px',
    },
    spacings: {
      left: small,
      right: small,
      top: '6px',
      bottom: '6px',
    },
    border: {
      width: '1px',
      color: 'transparent',
      focus: {
        color: primaryColor,
      },
    },
    icon: {
      color: placeholderColor,
      border: {
        radius: '50%',
      },
      hover: {
        background: primaryHoverAlt,
      },
      clickbounds: {
        offset: '6px',
        height: '36px',
      },
    },
  },
}
