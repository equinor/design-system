import { tokens } from '@equinor/eds-tokens'

const {
  colors: {
    ui: {
      background__default: { rgba: whiteColor },
      background__light: { rgba: lightGrayColor },
    },
  },
  spacings: { comfortable },
  typography: { navigation },
} = tokens

export const drawer = {
  height: '64px',
  background: whiteColor,
  itemHoverBackground: lightGrayColor,
  itemSpacings: {
    left: comfortable.medium,
    right: comfortable.medium,
    top: comfortable.medium,
    bottom: comfortable.medium,
  },
  itemTypography: {
    fontSize: navigation.drawer_inactive.fontSize,
    fontWeight: navigation.drawer_inactive.fontWeight,
    lineHeight: navigation.drawer_inactive.lineHeight,
    color: navigation.drawer_inactive.color,
  },
  subtitleTypography: {
    fontSize: navigation.label.fontSize,
    fontWeight: navigation.label.fontWeight,
    lineHeight: navigation.label.lineHeight,
    color: navigation.label.color,
  },
  border: {
    right: { color: lightGrayColor, width: '2px' },
  },
  subtitleBorder: {
    top: { color: lightGrayColor, width: '1px' },
  },
  itemBorder: {
    left: { color: lightGrayColor, width: '2px' },
  },
}
