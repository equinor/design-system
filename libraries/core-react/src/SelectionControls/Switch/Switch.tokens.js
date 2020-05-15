import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__medium: { rgba: backgroundColorMedium },
    },
    interactive: {
      primary__hover_alt: { rgba: primaryHover },
      primary__selected_highlight: { rgba: activeColor },
      primary__resting: { rgba: activeHandleColor },
      disabled__fill: { rgba: backgroundColorDisabled },
      focus: { rgba: focusOutlineColor },
    },
    text: {
      static_icons__tertiary: { rgba: handleColor },
    },
  },
  elevation: { raised: boxShadow },
} = tokens
export const switchControl = {
  color: {},
  enabled: {
    height: '48px',
    size: '16px',
    track: {
      width: '34px',
      height: '8px',
      borderRadius: '4px',
      background: backgroundColorMedium,
      activeBackground: activeColor,
    },
    handle: {
      boxShadow,
      background: handleColor,
      activeBackground: activeHandleColor,
    },
    hover: {
      background: primaryHover,
    },
    outline: `1px dashed ${focusOutlineColor}`,
    outlineOffset: '4px',
  },
  disabled: {
    background: backgroundColorDisabled,
  },
}
