import * as React from 'react'
import { TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { Is, Variants, Colors } from '../Table.types'
import { TableDataCell } from './DataCell'
import { TableHeaderCell } from './HeaderCell'

type CellProps = {
  /** Specifies which td or th to use */
  as?: Is
  /** Specifies which variant to use */
  variant?: Variants
  /** Specifies cell background color */
  color?: Colors
  /** Specifies cell sort direction */
  sortDirection?: React.AriaAttributes['aria-sort']
} & (
  | TdHTMLAttributes<HTMLTableDataCellElement>
  | ThHTMLAttributes<HTMLTableHeaderCellElement>
)

export const Cell = ({ as = 'td', ...props }: CellProps): JSX.Element => {
  switch (as) {
    case 'th':
      return <TableHeaderCell {...props} />
    default:
    case 'td':
      return <TableDataCell {...props} />
  }
}

// Cell.displayName = 'eds-table-cell'
