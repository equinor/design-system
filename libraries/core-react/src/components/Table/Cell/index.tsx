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
>(function Cell({ ...rest }, ref) {
  return (
    <InnerContext.Consumer>
      {({ variant, sticky }) => {
        switch (variant) {
          case 'head':
            return <TableHeaderCell ref={ref} sticky={sticky} {...rest} />
          default:
          case 'body':
            return <TableDataCell ref={ref} {...rest} />
        }
      }}
    </InnerContext.Consumer>
  )
})
