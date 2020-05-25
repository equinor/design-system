import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__medium: { rgba: backgroundColorMedium },
    },
    interactive: {
      primary__hover_alt: { rgba: primaryHoverAlt },
      primary__hover: { rgba: primaryHover },
      primary__selected_highlight: { rgba: activeColor },
      primary__resting: { rgba: primaryResting },
      disabled__fill: { rgba: backgroundColorDisabled },
      focus: { rgba: focusOutlineColor },
      icon_on_interactive_colors: { rgba: handleColorSmall },
    },
    text: {
      static_icons__tertiary: { rgba: handleColor },
    },
  },
  typography: {
    navigation: { menu_title: labelTypography },
  },
  elevation: { raised: boxShadow },
} = tokens
export const switchControl = {
  color: {},
  enabled: {
    typography: {
      ...labelTypography,
    },
    clickSize: '48px',
    track: {
      width: '34px',
      height: '8px',
      borderRadius: '4px',
      background: backgroundColorMedium,
      activeBackground: activeColor,
      small: {
        width: '20px',
        height: '10px',
        background: primaryResting,
      },
    },
    handle: {
      boxShadow,
      background: handleColor,
      activeBackground: primaryResting,
      size: '16px',
      small: {
        size: '6px',
        background: handleColorSmall,
      },
    },
    hover: {
      background: primaryHoverAlt,
      handle: {
        background: primaryHover,
        small: {
          background: primaryHoverAlt,
        },
      },
      track: {
        small: {
          background: primaryHover,
        },
      },
    },
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '6px',
    outlineOffsetSmall: '4px',
  },
  disabled: {
    background: backgroundColorDisabled,
  },
}
