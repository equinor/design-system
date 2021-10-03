import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { large: spacingLarge },
  },
  typography: {
    input: { text },
    navigation: { menu_title, button },
  },
  colors: {
    ui: {
      background__light: { rgba: background },
    },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

export type DatePickerToken = ComponentToken

export const datePicker: DatePickerToken = {
  width: '312px',
  background,
  border: {
    type: 'border',
    radius: borderRadius,
  },
  spacings: {
    top: spacingLarge,
    bottom: spacingLarge,
    right: '20px',
  },
  entities: {
    button: {
      typography: button,
    },
    title: {
      typography: menu_title,
    },
    text: {
      typography: text,
    },
  },
}
