import { ComponentToken, tokens } from '@equinor/eds-tokens'

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
      disabled__fill: { rgba: backgroundDisabled },
      focus: { rgba: focusOutlineColor },
      icon_on_interactive_colors: { rgba: iconInteractive },
    },
    text: {
      static_icons__tertiary: { rgba: iconTertiary },
    },
  },
  typography: {
    navigation: { menu_title: labelTypography },
  },
  clickbounds,
  elevation: { raised: boxShadow },
  spacings: {
    comfortable: { medium_small },
  },
  shape: {
    circle,
    _modes: {
      compact: { icon_button: compactIconButton },
    },
  },
  interactions: {
    focused: { width: focusOutlineWidth },
  },
} = tokens

export type SwitchToken = ComponentToken

export const comfortable: SwitchToken = {
  typography: labelTypography,
  height: circle.minHeight,
  width: circle.minWidth,
  clickbound: {
    height: clickbounds.default__base,
    width: clickbounds.default__base,
    offset: {
      top: `${
        (parseInt(clickbounds.default__base) - parseInt(circle.minHeight)) / 2
      }px`,
      left: `${
        (parseInt(clickbounds.default__base) - parseInt(circle.minWidth)) / 2
      }px`,
    },
  },
  entities: {
    label: {
      spacings: {
        left: medium_small,
      },
    },
    track: {
      width: '32px',
      height: '8px',
      background: backgroundColorMedium,
      border: {
        type: 'border',
        radius: '4px',
      },
      states: {
        active: {
          background: activeColor,
        },
        hover: {
          background: primaryHover,
        },
      },
    },
    handle: {
      height: '16px',
      width: '16px',
      boxShadow,
      background: iconTertiary,
      states: {
        active: {
          background: primaryResting,
        },
        hover: {
          background: primaryHoverAlt,
        },
      },
    },
  },
  modes: {
    compact: {
      height: compactIconButton.minHeight,
      width: compactIconButton.minWidth,
      clickbound: {
        height: clickbounds.compact__standard,
        width: clickbounds.compact__standard,
        offset: {
          top: `${
            (parseInt(clickbounds.compact__standard) -
              parseInt(compactIconButton.minHeight)) /
            2
          }px`,
          left: `${
            (parseInt(clickbounds.compact__standard) -
              parseInt(compactIconButton.minWidth)) /
            2
          }px`,
        },
      },
      entities: {
        track: {
          width: '20px',
          height: '10px',
          states: {
            disabled: {
              background: iconTertiary,
            },
            active: {
              background: primaryResting,
            },
          },
        },
        handle: {
          height: '6px',
          width: '6px',
          background: iconInteractive,
        },
      },
    },
  },
  states: {
    disabled: {
      background: backgroundDisabled,
    },
    focus: {
      outline: {
        width: focusOutlineWidth,
        type: 'outline',
        style: 'dashed',
        color: focusOutlineColor,
      },
    },
    hover: {
      background: primaryHoverAlt,
      entities: {
        handle: {
          background: primaryHover,
        },
      },
    },
  },
}
