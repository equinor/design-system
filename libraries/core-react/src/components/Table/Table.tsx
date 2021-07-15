import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { token } from './DataCell/DataCell.tokens'

const TableBase = styled.table`
  border-spacing: 0;
  background: ${token.background};
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
