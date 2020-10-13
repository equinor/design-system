import tableTokens from '@equinor/eds-tokens/components/table/table.json'
import type {
  Border,
  Clickbounds,
  Spacing,
  Typography,
} from '@equinor/eds-tokens'

const { header, cell } = tableTokens

const variants = {
  header: { text: header.text },
  cell: {
    text: cell.text,
    numeric: cell.monospaced_numeric,
    icon: cell.icon,
    input: cell.input,
  },
}

type Field = {
  field: {
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
}

export type TableCell = {
  height: string
  background: string
  borders: {
    bottom: Border
  }
  text: {
    color: string
    typography: Typography
  }
  spacings: Spacing
  clickbound: Clickbounds
  field: Field
  active: {
    background: string
    color: string
    typography: Typography
    borders: {
      bottom: Border
    }
    field: Field
  }
  disabled: {
    background: string
    color: string
    typography: Typography
    borders: {
      bottom: Border
    }
    field: Field
  }
  focus: {
    type: string
    color: string
    width: string
    gap: string
    field: Field
  }
  hover: {
    background: string
    field: Field
  }
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
