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
      table__cell__fill_hover: { rgba: focusBackgroundColor },
      table__cell__fill_activated: { rgba: activeBackgroundColor },
    },
  },
  interactions: { focused: outline },
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
  states: {
    hover: {
      background: hoverBackgroundColor,
    },
    focus: {
      background: focusBackgroundColor,
    },
    active: {
      background: activeBackgroundColor,
      outline: {
        type: 'outline',
        offset: '-1px',
        style: 'solid',
        color: outline.color,
        width: outline.width,
      },
    },
  },
}
