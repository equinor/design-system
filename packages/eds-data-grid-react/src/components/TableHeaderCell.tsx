import {
  ColumnResizeMode,
  flexRender,
  Header,
  SortDirection,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { useTableContext } from '../EdsDataGridContext'
import { useMemo } from 'react'
import { FilterWrapper } from './FilterWrapper'
import { SortIndicator } from './SortIndicator'
import { ResizeInner, Resizer } from './Resizer'
import { TableCell } from './TableCell'
import styled from 'styled-components'

const SortButton = styled.button`
  cursor: pointer;
  height: 100%;
  width: calc(100% - 5px); /* Leave space for resizer */
  display: flex;
  flex-direction: row;
  align-items: center;
  background: transparent;
  border: none;
  padding-left: var(--eds_table__cell__padding_x, 16px);
  padding-right: var(--eds_table__cell__padding_x, 16px);
  margin: 0;
  outline: none;
  color: inherit;
  text-align: left;
  font: inherit;
`

const TableHeaderCellLabel = styled.div`
  display: flex;
  flex-direction: column;
`

type Props<T> = {
  header: Header<T, unknown>
  columnResizeMode: ColumnResizeMode | null | undefined
  // eslint-disable-next-line react/no-unused-prop-types
  deltaOffset: number | null
  // eslint-disable-next-line react/no-unused-prop-types
  table: TanStackTable<T>
}

const getSortLabel = (
  sorted: false | SortDirection,
): 'none' | 'ascending' | 'descending' => {
  if (sorted) {
    return `${sorted}ending`
  }
  return 'none'
}

export function TableHeaderCell<T>({ header, columnResizeMode }: Props<T>) {
  const ctx = useTableContext()
  const table = ctx.table
  const pinned = header.column.getIsPinned()
  const canSort = header.column.getCanSort()
  const canFilter = header.column.getCanFilter()

  const offset = useMemo<number>(() => {
    if (!pinned) {
      return null
    }
    return pinned === 'left'
      ? header.getStart()
      : table.getTotalSize() - header.getStart() - header.getSize()
  }, [pinned, header, table])

  const tableCellPadding = useMemo(() => {
    if (canSort && canFilter) {
      return '0 var(--eds_table__cell__padding_x, 16px) 0 0'
    }
    if (canSort) {
      return '0'
    }
    return '0 var(--eds_table__cell__padding_x, 16px) 0 var(--eds_table__cell__padding_x, 16px)'
  }, [canSort, canFilter])

  return header.isPlaceholder ? (
    <TableCell
      $sticky={ctx.stickyHeader}
      $offset={offset}
      $pinned={pinned}
      className={ctx.headerClass ? ctx.headerClass(header.column) : ''}
      style={{
        ...(ctx.headerStyle ? ctx.headerStyle(header.column) : {}),
      }}
      aria-hidden={true}
    />
  ) : (
    <TableCell
      $sticky={ctx.stickyHeader}
      $offset={offset}
      $pinned={pinned}
      className={ctx.headerClass ? ctx.headerClass(header.column) : ''}
      aria-sort={getSortLabel(header.column.getIsSorted())}
      key={header.id}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        verticalAlign: ctx.enableColumnFiltering ? 'top' : 'middle',
        ...(ctx.headerStyle ? ctx.headerStyle(header.column) : {}),
        padding: tableCellPadding,
      }}
    >
      {canSort ? (
        <SortButton
          tabIndex={-1}
          onClick={header.column.getToggleSortingHandler()}
        >
          <TableHeaderCellLabel className="table-header-cell-label">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableHeaderCellLabel>
          {!header.column.columnDef.meta?.customFilterInput && (
            <SortIndicator column={header.column} />
          )}
        </SortButton>
      ) : (
        <TableHeaderCellLabel className="table-header-cell-label">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableHeaderCellLabel>
      )}

      {canFilter && !header.column.columnDef.meta?.customFilterInput ? (
        <FilterWrapper column={header.column} />
      ) : null}

      {columnResizeMode && (
        <Resizer
          onMouseDown={(e) => {
            header.getResizeHandler()(e)
          }}
          onTouchStart={(e) => {
            header.getResizeHandler()(e)
          }}
          $isResizing={header.column.getIsResizing()}
          $columnResizeMode={columnResizeMode}
          className={'resize-handle'}
          data-testid={'resize-handle'}
        >
          <ResizeInner />
        </Resizer>
      )}
    </TableCell>
  )
}
