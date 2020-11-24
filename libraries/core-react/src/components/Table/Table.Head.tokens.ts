import { Outline, tokens } from '@equinor/eds-tokens'
import type { Typography, Spacing, Borders } from '@equinor/eds-tokens'
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

type ComponentToken = {
  height: string
  background: string
  spacings: Spacing
  border: Borders
  typography: Typography
  outline?: Outline
}

const tableHead: ComponentToken = {
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
  active: Partial<ComponentToken>
  disabled: Partial<ComponentToken>
  focus: Partial<ComponentToken>
  hover: Partial<ComponentToken>
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
}

type TableHeadTokens = ComponentToken & {
  states: TableHeadStates
}

const mergeToken = R.curry(R.mergeDeepRight)(tableHead)

export const token: TableHeadTokens = {
  ...tableHead,
  states,
  // states: {
  //   active: mergeToken(states.active),
  //   disabled: mergeToken(states.disabled),
  //   focus: mergeToken(states.focus),
  //   hover: mergeToken(states.hover),
  // }
}
