import { tokens } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'
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
  height: 'var(--eds_table__cell__height, 48px)',
  background: backgroundColor,
  align: {
    vertical: 'var(--eds_table__cell__vertical_align, inherit)',
  },
  border: {
    type: 'bordergroup',
    bottom: {
      color: borderColor,
      width: '1px',
      style: 'solid',
    },
  },
  spacings: {
    top: 'var(--eds_table__cell__padding_y, 0)',
    bottom: 'var(--eds_table__cell__padding_y, 0)',
    left: `var(--eds_table__cell__padding_x, ${medium})`,
    right: `var(--eds_table__cell__padding_x, ${medium})`,
  },
  typography: {
    ...cellTypography,
    color: typographyColor,
    fontSize: `var(--eds_table__font_size, ${cellTypography.fontSize})`,
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
      height: 'var(--eds_table__cell__height_compact, 32px)',
      typography: {
        ...compactTypography.table.cell_text,
        color: typographyColor,
      },
      spacings: {
        top: 'var(--eds_table__cell__padding_y_compact, 0)',
        bottom: 'var(--eds_table__cell__padding_y_compact, 0)',
        left: `var(--eds_table__cell__padding_x_compact, ${medium})`,
        right: `var(--eds_table__cell__padding_x_compact, ${medium})`,
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

export const applyVariant = (variant: Variants, token: TableCellToken) => {
  switch (variant) {
    case 'numeric':
      return mergeDeepRight(token, token.variants.numeric) as TableCellToken

    default:
      return token
  }
}
