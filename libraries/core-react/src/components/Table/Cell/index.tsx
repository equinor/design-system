import * as React from 'react'
import { TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { Is, Variants } from '../Table.types'
import { TableDataCell } from './TableDataCell'
import { TableHeaderCell } from './TableHeaderCell'

type CellProps = {
  /** Specifies which td or th to use */
  as?: Is
  /** Specifies which variant to use */
  variant?: Variants
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
