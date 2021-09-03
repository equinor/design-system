import { tokens } from '@equinor/eds-tokens'
import * as R from 'ramda'
import type { ComponentToken } from '@equinor/eds-tokens'
import { Variants } from '../Table.types'

const {
  typography: {
    table: {
      cell_text: cellTypography,
      cell_numeric_monospaced: cellNumericTypography,
    },
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
      table__cell__fill_resting: { rgba: backgroundColor },
      table__cell__fill_hover: { rgba: hoverBackgroundColor },
      table__cell__fill_activated: { rgba: activeBackgroundColor },
      danger__highlight: { rgba: errorColor },
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

type Validation = {
  error: Partial<ComponentToken>
}

type VariantsType = {
  numeric: Partial<ComponentToken>
}

export type TableCellToken = ComponentToken & {
  validation: Validation
  variants: VariantsType
}

export const tableCell: TableCellToken = {
  height: '48px',
  background: backgroundColor,
  border: {
    type: 'bordergroup',
    bottom: {
      color: borderColor,
      width: '1px',
      style: 'solid',
    },
  },
  spacings: {
    top: '0',
    bottom: '0',
    left: medium,
    right: medium,
  },
  typography: {
    ...cellTypography,
    color: typographyColor,
  },
  states: {
    active: {
      background: activeBackgroundColor,
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
  },
  modes: {
    compact: {
      height: '32px',
      typography: {
        ...compactTypography.table.cell_text,
        color: typographyColor,
      },
    },
  },
  validation: {
    error: {
      background: errorColor,
    },
  },
  variants: {
    numeric: {
      typography: { ...cellNumericTypography, color: typographyColor },
      modes: {
        compact: {
          typography: {
            ...compactTypography.table.cell_numeric_monospaced,
            color: typographyColor,
          },
        },
      },
    },
  },
}

export const applyVariant = (
  variant: Variants,
  token: TableCellToken,
): TableCellToken => {
  switch (variant) {
    case 'numeric':
      return R.mergeDeepRight(token, token.variants.numeric)

    default:
      return token
  }
}
