import { Table } from '@equinor/eds-core-react'
import { Row } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { useTableContext } from '../EdsDataGridContext'
import { EdsDataGridProps } from '../EdsDataGridProps'
import { TableBodyCell } from './TableBodyCell'
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

type Props<T> = {
  row: Row<T>
  onCellClick?: EdsDataGridProps<T>['onCellClick']
  rowVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  virtualItem?: VirtualItem
} & HTMLAttributes<HTMLTableRowElement>

export function TableRow<T>({
  row,
  onCellClick,
  onClick,
  onDoubleClick,
  onContextMenu,
  rowVirtualizer,
  virtualItem,
}: Props<T>) {
  const { rowClass, rowStyle } = useTableContext()

  return (
    <StyledTableRow
      data-index={virtualItem?.index}
      ref={(node) => node && rowVirtualizer?.measureElement(node)} //measure dynamic row height
      style={{
        ...(rowStyle?.(row) ?? {}),
      }}
      className={`${row.getIsSelected() ? 'selected' : ''} ${rowClass?.(row)}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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
