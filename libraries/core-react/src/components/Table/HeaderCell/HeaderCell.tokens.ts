import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    table: { cell_header: cellTypography },
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

export type TableHeadToken = ComponentToken & {
  density: Density
}

type Density = {
  compact: ComponentToken
}

const density: Density = {
  compact: {
    height: '32px',
  },
}

const tableHead: ComponentToken = {
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
}

export const token: TableHeadToken = { ...tableHead, density }
