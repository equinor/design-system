/* eslint-disable camelcase */
import { tokens } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { small },
  },
  typography: {
    ui: { chip__badge },
  },
  colors: {
    ui: { background__light },
    interactive: {
      primary__resting,
      disabled__text,
      focus,
      primary__selected_highlight,
      danger__resting,
    },
  },
  shape: { rounded },
} = tokens

export const chips = {
  enabled: {
    background: background__light.rgba,
    height: '24px',
    border: {
      radius: rounded.borderRadius,
    },
    spacings: {
      left: small,
      right: small,
    },
    typography: {
      ...chip__badge,
      color: primary__resting.rgba,
    },
  },
  disabled: {
    typography: {
      color: disabled__text.rgba,
    },
  },
  focus: {
    border: {
      type: 'dashed',
      color: focus.rgba,
      width: '2px',
      radius: rounded.borderRadius,
    },
  },
  active: {
    background: primary__selected_highlight.rgba,
  },
  error: {
    border: {
      color: danger__resting.rgba,
    },
    typography: {
      color: danger__resting.rgba,
    },
  },
}
