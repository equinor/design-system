import { forwardRef, HTMLAttributes } from 'react'
import { styled } from 'styled-components'
import { tableCell } from './DataCell/DataCell.tokens'

const TableBase = styled.table`
  border-spacing: 0;
  background: ${tableCell.background};
`

export type TableProps = HTMLAttributes<HTMLTableElement>

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { children, ...props },
  ref,
) {
  return (
    <TableBase {...props} ref={ref}>
      {children}
    </TableBase>
  )
})

// Table.displayName = 'EdsTable'
