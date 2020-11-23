import { tokens } from '@equinor/eds-tokens'

import type {
  Border,
  Clickbound,
  Typography,
  Spacing,
  Borders,
  SpacingTokens,
} from '@equinor/eds-tokens'

const {
  components: {
    table: { header, cell },
  },
  typography: {
    table: { cell_header: cellTypography },
  },
  colors: {
    interactive: {
      table__header__fill_resting: { rgba: tableHeaderRestingColor },
      primary__resting: { rgba: primaryRestingColor },
      disabled__text: { rgba: disabledText },
      disabled__border: { rgba: disabledBorder },
      focus: { rgba: focusColor },
    },
  },
  spacings: {
    comfortable: { medium },
  },
} = tokens

type Field = {
  height: string
  background: string
  borders: {
    outline: Border
  }
  text: {
    color: string
    typography: Typography
    colorPlaceholder: string
  }
  spacings: Spacing
}

export type TableCell = {
  height: string
  background: string
  borders: {
    bottom: Border
  }
  text?: {
    color: string
    typography: Typography
  }
  spacings: Spacing
  clickbound: Clickbound
  field?: Field
  active: {
    background: string
    color?: string
    typography?: Typography
    borders: {
      bottom: Border
    }
    field?: Field
  }
  disabled: {
    background: string
    color?: string
    typography?: Typography
    borders: {
      bottom: Border
    }
    field?: Field
  }
  focus: {
    type?: string
    color?: string
    width?: string
    gap?: string
    field?: Field
  }
  hover: {
    background: string
    field?: Field
  }
}

type Variants = {
  header: {
    text: TableCell
  }
  cell: {
    text: TableCell
    numeric: TableCell
    icon: TableCell
    input: TableCell
  }
}

type TableCellToken = {
  height: string
  spacings: Spacing
  border: Borders
  typography: Typography
  states?: {
    active?: Partial<TableCellToken>
    disabled?: Partial<TableCellToken>
    focus?: Partial<TableCellToken>
    hover?: Partial<TableCellToken>
  }
}

type BaseVariantsProps = {
  header: TableCellToken
  cell?: {
    text: TableCellToken
    numeric: TableCellToken
    icon: TableCellToken
    input: TableCellToken
  }
}

const variants: Variants = {
  header: { text: header.text },
  cell: {
    text: cell.text,
    numeric: cell.monospaced_numeric,
    icon: cell.icon,
    input: cell.input,
  },
}

const size = {
  compact: '48px',
  comfortable: '32px',
}

const baseVariants: BaseVariantsProps = {
  header: {
    height: '48px',
    typography: cellTypography,
    border: {
      type: 'bordergroup',
      bottom: {
        type: 'border',
        width: '2px',
        color: tableHeaderRestingColor,
        style: 'solid',
      },
    },
    spacings: {
      left: medium,
      right: medium,
    },
    states: {
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
          color: disabledText,
        },
        border: {
          type: 'bordergroup',
          bottom: {
            color: disabledBorder,
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
    },
  },
}

export const getTokens = (as: string, variant: string): TableCell => {
  switch (as) {
    case 'th':
      return variants.header[variant] as TableCell
    case 'td':
    default:
      return variants.cell[variant] as TableCell
  }
}
