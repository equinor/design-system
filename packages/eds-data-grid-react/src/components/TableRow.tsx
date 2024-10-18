import { Table } from '@equinor/eds-core-react'
import { Row } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { useTableContext } from '../EdsDataGridContext'
import { EdsDataGridProps } from '../EdsDataGridProps'
import { TableBodyCell } from './TableBodyCell'

type Props<T> = {
  row: Row<T>
  onCellClick?: EdsDataGridProps<T>['onCellClick']
} & HTMLAttributes<HTMLTableRowElement>

export function TableRow<T>({
  row,
  onCellClick,
  onClick,
  onContextMenu,
}: Props<T>) {
  const { rowClass, rowStyle } = useTableContext()

  return (
    <StyledTableRow
      style={{
        ...(rowStyle?.(row) ?? {}),
      }}
      className={`${row.getIsSelected() ? 'selected' : ''} ${rowClass?.(row)}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {row.getVisibleCells().map((cell) => (
        <TableBodyCell
          key={cell.id}
          cell={cell}
          onClick={
            onCellClick ? (event) => onCellClick(cell, event) : undefined
          }
        />
      ))}
    </StyledTableRow>
  )
}

// Neccessary to have this attribute as class to prevent overriding hover color
const StyledTableRow = styled(Table.Row)`
  background-color: inherit;
`
