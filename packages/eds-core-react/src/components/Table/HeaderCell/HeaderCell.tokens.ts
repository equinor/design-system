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
  height: 'var(--eds_table__header__height, 48px)',
  background: backgroundColor,
  align: {
    vertical: 'var(--eds_table__header__vertical_align, inherit)',
  },
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
    top: 'var(--eds_table__cell__padding_y, 0)',
    bottom: 'var(--eds_table__cell__padding_y, 0)',
    left: `var(--eds_table__cell__padding_x, ${medium})`,
    right: `var(--eds_table__cell__padding_x, ${medium})`,
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
      height: 'var(--eds_table__header__height_compact, 32px)',
      typography: compactTypography.table.cell_header,
      spacings: {
        top: 'var(--eds_table__header__padding_top_compact, 0)',
        bottom: 'var(--eds_table__header__padding_bottom_compact, 0)',
        left: `var(--eds_table__header__padding_left_compact, ${medium})`,
        right: `var(--eds_table__header__padding_right_compact, ${medium})`,
      },
    },
  },
}
