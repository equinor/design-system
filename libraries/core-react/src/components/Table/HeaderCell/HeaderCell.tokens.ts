import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    table: { cell_header: cellTypography },
    _modes: { compact: compactTypography },
  },
  colors: {
    text: {
      static_icons__default: { rgba: typographyColor },
    },
    ui: {
      background__medium: { rgba: borderColor },
    },
    interactive: {
      table__header__fill_resting: { rgba: backgroundColor },
      table__header__fill_hover: { rgba: hoverBackgroundColor },
      table__header__fill_activated: { rgba: activeBackgroundColor },
      primary__resting: { rgba: primaryRestingColor },
      disabled__text: { rgba: disabledTextColor },
      disabled__border: { rgba: disabledBorderColor },
      focus: { rgba: focusColor },
    },
  },
  spacings: {
    comfortable: { medium },
  },
} = tokens

export type TableHeadToken = ComponentToken

export const token: TableHeadToken = {
  height: '48px',
  background: backgroundColor,
  typography: { ...cellTypography, color: typographyColor },
  border: {
    type: 'bordergroup',
    bottom: {
      type: 'border',
      width: '2px',
      color: borderColor,
      style: 'solid',
    },
  },
  spacings: {
    top: '0',
    bottom: '0',
    left: medium,
    right: medium,
  },
  states: {
    active: {
      background: activeBackgroundColor,
      typography: {
        ...cellTypography,
        color: primaryRestingColor,
      },
      border: {
        type: 'bordergroup',
        bottom: {
          color: primaryRestingColor,
        },
      },
    },
    disabled: {
      typography: {
        ...cellTypography,
        color: disabledTextColor,
      },
      border: {
        type: 'bordergroup',
        bottom: {
          color: disabledBorderColor,
        },
      },
    },
    focus: {
      outline: {
        type: 'outline',
        color: focusColor,
        width: '1px',
        style: 'dashed',
      },
    },
    hover: {
      background: hoverBackgroundColor,
    },
  },
  modes: {
    compact: {
      height: '32px',
      typography: compactTypography.table.cell_header,
    },
  },
}
