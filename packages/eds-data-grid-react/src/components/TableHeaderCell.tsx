import {
  ColumnResizeMode,
  flexRender,
  Header,
  SortDirection,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { useTableContext } from '../EdsDataGridContext'
import { useMemo, useRef } from 'react'
import { FilterWrapper } from './FilterWrapper'
import { SortIndicator } from './SortIndicator'
import { ResizeInner, Resizer } from './Resizer'
import { TableCell } from './TableCell'

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

// Number of pixels the pointer must move horizontally to be considered a drag.
// A value of 3 provides a good balance between ignoring micro-movements from clicks
// and still allowing quick column resizing without accidental sorting.
const DRAG_TOLERANCE = 3

export function TableHeaderCell<T>({ header, columnResizeMode }: Props<T>) {
  const dragStartX = useRef<number | null>(null)
  const ctx = useTableContext()
  const table = ctx.table
  const pinned = header.column.getIsPinned()
  const offset = useMemo<number>(() => {
    if (!pinned) return null
    return pinned === 'left'
      ? header.getStart()
      : table.getTotalSize() - header.getStart() - header.getSize()
  }, [pinned, header, table])

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
      onClick={(event) => {
        const endX = event.clientX
        const hasDragged =
          dragStartX.current !== null &&
          Math.abs(endX - dragStartX.current) > DRAG_TOLERANCE

        if (!hasDragged && header.column.getCanSort()) {
          header.column.getToggleSortingHandler()?.(event)
        }

        setTimeout(() => {
          dragStartX.current = null
        }, 0)
      }}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        verticalAlign: ctx.enableColumnFiltering ? 'top' : 'middle',
        ...(ctx.headerStyle ? ctx.headerStyle(header.column) : {}),
      }}
    >
      <>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="table-header-cell-label">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
        </div>
        {!header.column.columnDef.meta?.customFilterInput && (
          <SortIndicator column={header.column} />
        )}
        {header.column.getCanFilter() &&
        !header.column.columnDef.meta?.customFilterInput ? (
          // Supressing this warning - div is not interactive, but prevents propagation of events to avoid unintended sorting
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div onClick={(e) => e.stopPropagation()}>
            <FilterWrapper column={header.column} />
          </div>
        ) : null}
      </>
      {columnResizeMode && (
        <Resizer
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            dragStartX.current = e.clientX
            header.getResizeHandler()?.(e)
          }}
          onTouchStart={(e) => {
            dragStartX.current = e.touches[0]?.clientX ?? null
            header.getResizeHandler()?.(e)
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
