import { tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing, Borders, Space } from '@equinor/eds-tokens'
import * as R from 'ramda'

const {
  typography: {
    table: { cell_header: cellTypography },
  },
  colors: {
    ui: {
      background__medium: { rgba: borderColor },
    },
    interactive: {
      table__header__fill_resting: { rgba: backgroundColor },
      table__cell__fill_hover: { rgba: hoverBackgroundColor },
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

type TableHead = {
  height: string
  background: string
  spacings: Spacing
  border: Borders
  typography: Typography
}

const tableHead: TableHead = {
  height: '48px',
  background: backgroundColor,
  typography: cellTypography,
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
    left: medium,
    right: medium,
  },
}

type TableHeadStates = {
  active: Partial<TableHead>
  disabled: Partial<TableHead>
  focus: Partial<TableHead>
  hover: Partial<TableHead>
}

const states: TableHeadStates = {
  active: {
    typography: {
      ...cellTypography,
      color: primaryRestingColor,
    },
    border: {
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
    border: {
      type: 'outline',
      color: focusColor,
      width: '1px',
      style: 'dashed',
    },
  },
  hover: {
    background: hoverBackgroundColor,
  },
}

type TableHeadTokens = {
  enabled: TableHead
  active: Partial<TableHead>
  disabled: Partial<TableHead>
  focus: Partial<TableHead>
  hover: Partial<TableHead>
}

const mergeToken = R.curry(R.mergeDeepRight)(tableHead)

export const tableHeadTokens: TableHeadTokens = {
  enabled: tableHead,
  active: mergeToken(states.active),
  disabled: mergeToken(states.disabled),
  focus: mergeToken(states.focus),
  hover: mergeToken(states.hover),
}
