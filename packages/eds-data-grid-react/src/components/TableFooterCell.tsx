import {
  ColumnResizeMode,
  flexRender,
  Header,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { useTableContext } from '../EdsDataGridContext'
import { useMemo } from 'react'
import { SortIndicator } from './SortIndicator'
import { ResizeInner, Resizer } from './Resizer'
import { TableCell } from './TableCell'

type Props<T> = {
  footer: Header<T, unknown>
  columnResizeMode: ColumnResizeMode | null | undefined
  // eslint-disable-next-line react/no-unused-prop-types
  deltaOffset: number | null
  // eslint-disable-next-line react/no-unused-prop-types
  table: TanStackTable<T>
}

export function TableFooterCell<T>({ footer, columnResizeMode }: Props<T>) {
  const ctx = useTableContext()
  const table = ctx.table
  const pinned = footer.column.getIsPinned()
  const offset = useMemo<number>(() => {
    if (!pinned) {
      return null
    }
    return pinned === 'left'
      ? footer.getStart()
      : table.getTotalSize() - footer.getStart() - footer.getSize()
  }, [pinned, footer, table])
  return footer.isPlaceholder ? (
    <TableCell
      $sticky={ctx.stickyFooter}
      $offset={offset}
      $pinned={pinned}
      className={ctx.footerClass ? ctx.footerClass(footer.column) : ''}
      style={{
        ...(ctx.footerStyle ? ctx.footerStyle(footer.column) : {}),
      }}
      aria-hidden={true}
    />
  ) : (
    <TableCell
      $sticky={ctx.stickyFooter}
      $offset={offset}
      $pinned={pinned}
      className={ctx.footerClass ? ctx.footerClass(footer.column) : ''}
      key={footer.id}
      onClick={footer.column.getToggleSortingHandler()}
      colSpan={footer.colSpan}
      style={{
        width: footer.getSize(),
        verticalAlign: ctx.enableColumnFiltering ? 'top' : 'middle',
        ...(ctx.footerStyle ? ctx.footerStyle(footer.column) : {}),
      }}
    >
      <>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="table-footer-cell-label">
            {flexRender(footer.column.columnDef.footer, footer.getContext())}
          </span>
        </div>
        {!footer.column.columnDef.meta?.customFilterInput && (
          <SortIndicator column={footer.column} />
        )}
      </>
      {columnResizeMode && (
        <Resizer
          onClick={(e) => e.stopPropagation()}
          onMouseDown={footer.getResizeHandler()}
          onTouchStart={footer.getResizeHandler()}
          $isResizing={footer.column.getIsResizing()}
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
