import {
  ColumnPinningPosition,
  ColumnResizeMode,
  flexRender,
  Header,
  SortDirection,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { Table } from '@equinor/eds-core-react'
import { useTableContext } from '../EdsDataGridContext'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { useMemo } from 'react'
import { FilterWrapper } from './FilterWrapper'
import { SortIndicator } from './SortIndicator'

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

type ResizeProps = {
  $columnResizeMode: ColumnResizeMode | null | undefined
  $isResizing: boolean
}

const ResizeInner = styled.div`
  width: 2px;
  opacity: 0;
  height: 100%;
`

const Resizer = styled.div<ResizeProps>`
  transform: ${(props) =>
    props.$columnResizeMode === 'onEnd' ? 'translateX(0px)' : 'none'};

  ${ResizeInner} {
    opacity: ${(props) => (props.$isResizing ? 1 : 0)};
  }

  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 5px;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  display: flex;
  justify-content: flex-end;
`

const Cell = styled(Table.Cell)<{
  $sticky: boolean
  $pinned: ColumnPinningPosition
  $offset: number
}>`
  font-weight: bold;
  position: ${(p) => (p.$sticky || p.$pinned ? 'sticky' : 'relative')};
  top: 0;
  ${(p) => {
    if (p.$pinned) {
      return `${p.$pinned}: ${p.$offset}px;`
    }
    return ''
  }}
  ${(p) => {
    if (p.$sticky && p.$pinned) return 'z-index: 13'
    if (p.$sticky || p.$pinned) return 'z-index: 12'
  }};
  &:hover ${ResizeInner} {
    background: ${tokens.colors.interactive.primary__hover.rgba};
    opacity: 1;
  }
`

export function TableHeaderCell<T>({ header, columnResizeMode }: Props<T>) {
  const ctx = useTableContext()
  const table = ctx.table
  const pinned = header.column.getIsPinned()
  const offset = useMemo<number>(() => {
    if (!pinned) {
      return null
    }
    return pinned === 'left'
      ? header.getStart()
      : table.getTotalSize() - header.getStart() - header.getSize()
  }, [pinned, header, table])
  return header.isPlaceholder ? (
    <Cell
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
    <Cell
      $sticky={ctx.stickyHeader}
      $offset={offset}
      $pinned={pinned}
      className={ctx.headerClass ? ctx.headerClass(header.column) : ''}
      aria-sort={getSortLabel(header.column.getIsSorted())}
      key={header.id}
      onClick={header.column.getToggleSortingHandler()}
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
          onClick={(e) => e.stopPropagation()}
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
    </Cell>
  )
}
