import * as React from 'react'
import { TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { Variants, Colors } from '../Table.types'
import { TableDataCell } from './DataCell'
import { TableHeaderCell } from './HeaderCell'
import { InnerContext } from '../Inner.context'

type CellProps = {
  /** Specifies which variant to use */
  variant?: Variants
  /** Specifies cell background color */
  color?: Colors
  /** Specifies cell sort direction */
  sort?: React.AriaAttributes['aria-sort']
} & (
  | TdHTMLAttributes<HTMLTableDataCellElement>
  | ThHTMLAttributes<HTMLTableHeaderCellElement>
)

export const Cell = (props: CellProps): JSX.Element => (
  <InnerContext.Consumer>
    {(value) => {
      switch (value.variant) {
        case 'head':
          return <TableHeaderCell {...props} />
        default:
        case 'body':
          return <TableDataCell {...props} />
      }
    }}
  </InnerContext.Consumer>
)

// Cell.displayName = 'eds-table-cell'
