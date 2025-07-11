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
  align: {
    vertical: 'inherit',
    horizontal: 'inherit',
  },
  //  states: {
  //   hover: {
  //     border: {
  //       type: 'border',
  //       width: '1px',
  //       color: 'transparent',
  //       style: 'solid',
  //     },
  //   },
  //   focus: {
  //     outline: {
  //       type: 'outline',
  //       offset: '3px',
  //       style: 'dashed',
  //       color: outline.color,
  //       width: outline.width,
  //     },
  //   },
  states: {
    hover: {
      outline: {
        type: 'outline',
        offset: '-1px',
        style: 'dashed',
        color: outline.color,
        width: outline.width,
      },
    },
    focus: {
      outline: {
        type: 'outline',
        offset: '-1px',
        style: 'dashed',
        color: outline.color,
        width: outline.width,
      },
    },
  },
}
