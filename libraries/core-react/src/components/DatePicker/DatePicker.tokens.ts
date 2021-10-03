import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  spacings: {
    comfortable: { large: spacingLarge },
  },
  typography: {
    input: { text, label },
    navigation: { menu_title, button },
  },
  colors: {
    ui: {
      background__light: { rgba: background },
    },
    infographic: {
      primary__moss_green_13: { rgba: primary13 },
      primary__moss_green_100: { rgba: primary100 },
    },
  },
  shape: {
    corners: { borderRadius },
  },
} = tokens

export interface DatePickerToken extends ComponentToken {
  colors: {
    green13: string
    green100: string
  }
}

export const datePicker: DatePickerToken = {
  width: '312px',
  background,
  colors: {
    green13: primary13,
    green100: primary100,
  },
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
    label: {
      typography: label,
    },
  },
}
