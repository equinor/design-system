import { Table } from '@equinor/eds-core-react'
import { Cell, ColumnPinningPosition, flexRender } from '@tanstack/react-table'
import { HTMLAttributes, useMemo } from 'react'
import styled from 'styled-components'
import { useTableContext } from '../EdsDataGridContext'

type Props<T> = {
  cell: Cell<T, unknown>
} & HTMLAttributes<HTMLTableCellElement>

const StyledCell = styled(Table.Cell)<{
  $pinned: ColumnPinningPosition
  $offset: number
}>`
  position: ${(p) => (p.$pinned ? 'sticky' : 'relative')};
  ${(p) => {
    if (p.$pinned) {
      return `${p.$pinned}: ${p.$offset}px;`
    }
    return ''
  }}
  z-index: ${(p) => (p.$pinned ? 11 : 'auto')};
  ${(p) => {
    // Ensure pinned elements maintain their borders by setting box-sizing and background
    if (p.$pinned) {
      return `
        box-sizing: border-box;
        background-color: inherit;
        background-clip: padding-box;
      `
    }
    return 'background-color: inherit;'
  }};
`

export function TableBodyCell<T>({ cell }: Props<T>) {
  const { cellClass, cellStyle, table } = useTableContext()

  const pinned = cell.column.getIsPinned()
  const pinnedOffset = useMemo<number>(() => {
    if (!pinned) {
      return 0
    }
    const header = table.getFlatHeaders().find((h) => h.id === cell.column.id)
    return pinned === 'left'
      ? header.getStart()
      : table.getTotalSize() - header.getStart() - cell.column.getSize()
  }, [pinned, cell.column, table])

  return (
    <StyledCell
      $pinned={pinned}
      $offset={pinnedOffset}
      className={cellClass ? cellClass(cell.row, cell.column.id) : ''}
      key={cell.id}
      style={{
        width: cell.column.getSize(),
        maxWidth: cell.column.getSize(),
        ...(cellStyle?.(cell.row, cell.column.id) ?? {}),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </StyledCell>
  )
}
