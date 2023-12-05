import { Cell, ColumnPinningPosition, flexRender } from '@tanstack/react-table'
import { Table, Typography } from '@equinor/eds-core-react'
import { useTableContext } from '../EdsDataGridContext'
import { useMemo } from 'react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

type Props<T> = {
  cell: Cell<T, unknown>
}

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
  background-color: ${(p) =>
    p.$pinned ? tokens.colors.ui.background__default.hex : 'inherit'};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
      {...{
        key: cell.id,
        style: {
          width: cell.column.getSize(),
          maxWidth: cell.column.getSize(),
          ...(cellStyle?.(cell.row, cell.column.id) ?? {}),
        },
      }}
    >
      <Typography as="span" group="table" variant="cell_text">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Typography>
    </StyledCell>
  )
}
