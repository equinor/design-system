import {
  ColumnResizeMode,
  flexRender,
  Header,
  SortDirection,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { useTableContext } from '../EdsDataGridContext'
import { useEffect, useMemo, useState } from 'react'
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

export function TableHeaderCell<T>({ header, columnResizeMode }: Props<T>) {
  const ctx = useTableContext()
  const table = ctx.table
  const pinned = header.column.getIsPinned()

  // Track resize in progress
  const [isResizing, setIsResizing] = useState(false)
  // Track when the last resize operation ended to prevent immediate sorting
  const [lastResizeTime, setLastResizeTime] = useState(0)

  const offset = useMemo<number>(() => {
    if (!pinned) {
      return null
    }
    return pinned === 'left'
      ? header.getStart()
      : table.getTotalSize() - header.getStart() - header.getSize()
  }, [pinned, header, table])

  // Enhanced cleanup function with debounce mechanism
  useEffect(() => {
    if (!isResizing) return

    const handleMouseUp = () => {
      setIsResizing(false)
      setLastResizeTime(Date.now())
    }

    // Capture events at the document level to ensure we catch all end events
    document.addEventListener('mouseup', handleMouseUp, { capture: true })
    document.addEventListener('touchend', handleMouseUp, { capture: true })

    return () => {
      document.removeEventListener('mouseup', handleMouseUp, { capture: true })
      document.removeEventListener('touchend', handleMouseUp, { capture: true })
    }
  }, [isResizing])

  // Handler for cell click that prevents sorting right after resize
  const handleCellClick = (e: React.MouseEvent) => {
    // Prevent sort if we're resizing or if resize just finished (within 300ms)
    if (isResizing || Date.now() - lastResizeTime < 300) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    header.column.getToggleSortingHandler()?.(e)
  }

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
      onClick={handleCellClick}
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
            e.stopPropagation()
            e.preventDefault()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsResizing(true)
            header.getResizeHandler()(e)
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsResizing(true)
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
