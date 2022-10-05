export const interactions = {
  _modes: {
    compact: {
      pressed_dark_overlay: {
        blendMode: 'pass_through',
        pressedColor: 'transparent',
      },
      focused: {
        style: 'dashed',
        color: 'rgba(0, 112, 121, 1)',
        width: '2px',
      },
      pressed_light_overlay: {
        blendMode: 'pass_through',
        pressedColor: 'rgba(255, 255, 255, 1)',
      },
    },
  },
  pressed_dark_overlay: {
    blendMode: 'darken',
    pressedColor: 'rgba(0, 0, 0, 0.2)',
  },
  focused: {
    style: 'dashed',
    color: 'rgba(0, 112, 121, 1)',
    width: '2px',
  },
  pressed_light_overlay: {
    blendMode: 'pass_through',
    pressedColor: 'rgba(255, 255, 255, 0.2)',
  },
}
