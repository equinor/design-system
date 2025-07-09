import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    table: { cell_text: cellTypography },
  },
  colors: {
    text: {
      static_icons__default: { rgba: typographyColor },
    },
    interactive: {
      table__cell__fill_hover: { rgba: hoverBackgroundColor },
      focus: { rgba: focusColor },
    },
  },
} = tokens

export type ClickableCellToken = ComponentToken

export const clickableCell: ClickableCellToken = {
  width: '100%',
  height: '100%',
  background: 'transparent',
  typography: {
    ...cellTypography,
    color: typographyColor,
  },
  align: {
    vertical: 'inherit',
    horizontal: 'inherit',
  },
  states: {
    hover: {
      background: hoverBackgroundColor,
    },
    focus: {
      outline: {
        type: 'outline',
        color: focusColor,
        width: '2px',
        style: 'solid',
        offset: '-2px',
      },
    },
  },
}
