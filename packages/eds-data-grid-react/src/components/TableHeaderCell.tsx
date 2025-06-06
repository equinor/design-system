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
import { TableCell, FilterVisibility } from './TableCell'
import styled from 'styled-components'
import { useEds } from '@equinor/eds-core-react'

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
  deltaOffset: number | null
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
  const isFiltered = header.column.getIsFiltered()
  const filterValue = header.column.getFilterValue()
  const hasActiveFilters = useMemo(() => {
    if (!isFiltered) return false
    if (Array.isArray(filterValue)) {
      return filterValue.length > 0 && filterValue.some((v) => !!v || v === 0) // avoid empty strings counting
    }
    return !!filterValue
  }, [isFiltered, filterValue])
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

  const { density } = useEds()
  // Future improvement: If we down the line end up granting the ability to customize row height, we should move this to the table-context
  const rowHeight = density === 'compact' ? 32 : 48

  const vertOffset = ctx.stickyHeader
    ? (header.depth - 1) * rowHeight
    : undefined

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
        top: vertOffset,
      }}
      aria-hidden={true}
    />
  ) : (
    <TableCell
      $sticky={ctx.stickyHeader}
      $offset={offset}
      $pinned={pinned}
      $activeFilter={hasActiveFilters}
      className={ctx.headerClass ? ctx.headerClass(header.column) : ''}
      aria-sort={getSortLabel(header.column.getIsSorted())}
      key={header.id}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        verticalAlign: ctx.enableColumnFiltering ? 'top' : 'middle',
        ...(ctx.headerStyle ? ctx.headerStyle(header.column) : {}),
        padding: tableCellPadding,
        top: vertOffset,
      }}
    >
      {canSort ? (
        <SortButton
          tabIndex={-1}
          onClick={header.column.getToggleSortingHandler()}
          data-testid={`sort-button-${header.id}`}
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
        // Supressing this warning - div is not interactive, but prevents propagation of events to avoid unintended sorting
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <FilterVisibility onClick={(e) => e.stopPropagation()}>
          <FilterWrapper column={header.column} />
        </FilterVisibility>
      ) : null}

      {columnResizeMode && (
        <Resizer
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
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
