import { CSSProp } from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import mergeDeepRight from 'ramda/src/mergeDeepRight'
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
  verticalAlign: string
  css?: CSSProp
}

export const tableCell: TableCellToken = {
  height: 'var(--tableCell-height, 48px)',
  background: backgroundColor,
  verticalAlign: 'var(--tableCell-verticalAlign, inherit)',
  border: {
    type: 'bordergroup',
    bottom: {
      color: borderColor,
      width: '1px',
      style: 'solid',
    },
  },
  spacings: {
    top: 'var(--tableCell-paddingTop, 0)',
    bottom: 'var(--tableCell-paddingBottom, 0)',
    left: `var(--tableCell-paddingLeft, ${medium})`,
    right: `var(--tableCell-paddingRight, ${medium})`,
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
      return mergeDeepRight(token, token.variants.numeric)

    default:
      return token
  }
}
