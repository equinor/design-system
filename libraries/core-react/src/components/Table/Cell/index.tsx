import * as React from 'react'
import { TdHTMLAttributes, ThHTMLAttributes, forwardRef } from 'react'
import { Variants, Colors } from '../Table.types'
import { TableDataCell } from './DataCell'
import { TableHeaderCell } from './HeaderCell'
import { InnerContext } from '../Inner.context'

export type CellProps = {
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
export const Cell = forwardRef<
  HTMLTableDataCellElement | HTMLTableHeaderCellElement,
  CellProps
>(function Cell({ className, ...rest }, ref) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return (
    <InnerContext.Consumer>
      {({ variant, sticky }) => {
        switch (variant) {
          case 'head':
            return <TableHeaderCell sticky={sticky} {...props} />
          default:
          case 'body':
            return <TableDataCell {...props} />
        }
      }}
    </InnerContext.Consumer>
  )
})
