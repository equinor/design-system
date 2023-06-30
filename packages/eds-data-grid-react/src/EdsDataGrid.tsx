/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table'
import { Pagination, Table, useEds } from '@equinor/eds-core-react'
import {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableRow } from './components/TableRow'
import { TableProvider } from './EdsDataGridContext'
import { useVirtualizer } from '@tanstack/react-virtual'

export type EdsDataGridProps<T> = {
  /**
   * The rows to display in the table
   */
  rows: Array<T>
  /**
   * Definition of the columns to display in the table
   */
  columns: ColumnDef<T>[]
  /**
   * The mode of column resizing. If not set, column resizing is disabled.
   * Can be either 'onChange' or 'onEnd'
   * @default undefined
   */
  columnResizeMode?: ColumnResizeMode
  /**
   * Set this to enable rowSelection. If a function is provided, it will be called for each row to determine if it is selectable.
   * @default false
   */
  rowSelection?: boolean | ((row: Row<T>) => boolean)
  /**
   * Callback for when row-selection changes
   */
  onSelectRow?: OnChangeFn<RowSelectionState>
  /**
   * Enable debug mode. See https://tanstack.com/table/v8/docs/api/core/table#debugall
   * @default false
   */
  debug?: boolean
  /**
   * Enable sorting.
   * @default false
   */
  enableSorting?: boolean
  /**
   * Make the table header sticky
   * @default false
   */
  stickyHeader?: boolean
  /**
   * Element to display in Table.Caption
   * @default undefined
   */
  caption?: ReactElement
  /**
   * Whether to enable column filtering, adding inputs to the header cells
   * Individual columns can be configured to disable filtering
   * @default false
   */
  enableColumnFiltering?: boolean
  /**
   * Whether pagination should be enabled.
   * @default false
   */
  enablePagination?: boolean
  /**
   * The number of rows per page
   * Only used if enablePagination is true
   * @default 25
   */
  pageSize?: number
  /**
   * The message to display when there are no rows
   * @default undefined
   */
  emptyMessage?: string
  /**
   * The currently selected rows
   * @default {}
   */
  selectedRows?: Record<string | number, boolean>
  /**
   * Whether to enable virtualization. This will render only the visible rows currently in view.
   * @default false
   */
  enableVirtual?: boolean
  /**
   * The height of the virtualized table in pixels.
   * @default 500
   */
  virtualHeight?: number
  /**
   * Which columns are visible. If not set, all columns are visible. undefined means that the column is visible.
   * @default undefined
   */
  columnVisibility?: Record<string, boolean>
  /**
   * Callback for when column visibility changes. Only called if columnVisibility is set.
   * @param columnVisibility
   */
  columnVisibilityChange?: (columnVisibility: Record<string, boolean>) => void
  /**
   * An array of the columnIds in the order they should be displayed.
   */
  columnOrder?: Array<string>
  /**
   * Function that can be used to set custom css on a cell
   * @param row
   * @param columnId
   */
  cellStyle?: (row: Row<T>, columnId: string) => CSSProperties
  /**
   * Function that can be used to set a custom class on a cell
   * @param row
   * @param columnId
   * @returns string with list of classes
   */
  cellClass?: (row: Row<T>, columnId: string) => string
  /**
   * Function that can be used to set a custom class on a row
   * @param row
   * @returns string with list of classes
   */
  rowClass?: (row: Row<T>) => string
  /**
   * Function that can be used to set custom css on a row
   * @param row
   */
  rowStyle?: (row: Row<T>) => CSSProperties
  /**
   * Function that can be used to set custom classes on a header cell
   * @param column
   */
  headerClass?: (column: Column<T>) => string
  /**
   * Function that can be used to set custom styles on a header cell
   * @param column
   */
  headerStyle?: (column: Column<T>) => CSSProperties
}

export function EdsDataGrid<T>({
  rows,
  columns,
  columnResizeMode,
  pageSize,
  rowSelection,
  selectedRows,
  enableColumnFiltering,
  debug,
  enablePagination,
  enableSorting,
  stickyHeader,
  onSelectRow,
  caption,
  enableVirtual,
  virtualHeight,
  columnVisibility,
  columnVisibilityChange,
  emptyMessage,
  columnOrder,
  cellClass,
  cellStyle,
  rowClass,
  rowStyle,
  headerClass,
  headerStyle,
}: EdsDataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selection, setSelection] = useState<RowSelectionState>(
    selectedRows ?? {},
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [visible, setVisible] = useState(columnVisibility ?? {})
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrderState, setColumnOrderState] = useState<string[]>([])
  const [page, setPage] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize ?? 25,
  })

  useEffect(() => {
    setVisible(columnVisibility ?? {})
  }, [columnVisibility, setVisible])

  /**
   * By default, the filter-function accepts single-value filters. This adds multi-filter functionality out of the box.
   */
  const _columns = useMemo(() => {
    return columns.map((column) => {
      if (column.filterFn || column.enableColumnFilter === false) {
        return column
      }
      /* istanbul ignore next */
      return {
        ...column,
        filterFn: (row, columnId, filterValue) => {
          if (debug) {
            console.log('filterFn', row, columnId, filterValue)
          }
          if (
            !filterValue ||
            ((Array.isArray(filterValue) || typeof filterValue === 'string') &&
              filterValue.length === 0)
          ) {
            return true
          }
          const value = row.getValue(columnId) ?? 'NULL_OR_UNDEFINED'
          if (Array.isArray(filterValue)) {
            const numeric = filterValue.some((v) => typeof v === 'number')
            if (numeric) {
              const [start, end] = filterValue as [number, number]
              return (
                value >= (isNaN(start) ? 0 : start) &&
                value <= (!end || isNaN(end) ? Infinity : end)
              )
            } else {
              const validFilterValue = filterValue.filter((v) => !!v)
              if (validFilterValue.length === 0) return true
              return filterValue.includes(value)
            }
          }
          return value === filterValue
        },
      } as ColumnDef<T>
    })
  }, [debug, columns])

  /**
   * Set up default table options
   */
  const options: TableOptions<T> = {
    data: rows,
    columns: _columns,
    columnResizeMode: columnResizeMode,
    state: {
      sorting,
      rowSelection: selection,
      columnOrder: columnOrderState,
    },
    onSortingChange: setSorting,
    enableColumnFilters: !!enableColumnFiltering,
    enableFilters: !!enableColumnFiltering,
    enableSorting: enableSorting ?? false,
    enableColumnResizing: !!columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: debug,
    debugHeaders: debug,
    debugColumns: debug,
    enableRowSelection: rowSelection ?? false,
  }

  useEffect(() => {
    if (columnOrder && columnOrder.length > 0) {
      setColumnOrderState(columnOrder ?? [])
    }
  }, [columnOrder])

  /**
   * Set up handlers for rowSelection
   */
  if (rowSelection ?? false) {
    options.onRowSelectionChange = (updaterOrValue) => {
      if (onSelectRow) {
        onSelectRow(updaterOrValue)
      }
      setSelection(updaterOrValue)
    }
  }

  /**
   * Set up config for column filtering
   */
  if (enableColumnFiltering) {
    options.state.columnFilters = columnFilters
    options.state.globalFilter = globalFilter
    options.onColumnFiltersChange = setColumnFilters
    options.onGlobalFilterChange = setGlobalFilter
    options.getFacetedRowModel = getFacetedRowModel()
    options.getFacetedUniqueValues = getFacetedUniqueValues()
    options.getFacetedMinMaxValues = getFacetedMinMaxValues()
    options.getFilteredRowModel = getFilteredRowModel()
  }

  /**
   * Set up config for pagination
   */
  if (enablePagination ?? false) {
    options.state.pagination = page
    options.getPaginationRowModel = getPaginationRowModel()
  }

  /**
   * Set up config to handle column visibility controls
   */
  if (columnVisibility) {
    options.state.columnVisibility = visible
    options.onColumnVisibilityChange = (vis) => {
      let updated: Record<string, boolean>
      if (typeof vis === 'function') {
        updated = vis(visible)
      } else {
        updated = vis
      }
      if (columnVisibilityChange) columnVisibilityChange(updated)
      setVisible(updated)
    }
  }

  useEffect(() => {
    setPage((prev) => ({ ...prev, pageSize: pageSize ?? 25 }))
  }, [pageSize])

  const table = useReactTable(options)

  let parentRefStyle: CSSProperties = {}

  /**
   * Style the parent container to enable virtualization.
   * By not setting this, the virtual-scroll will always render every row, reducing computational overhead if turned off.
   */
  if (enableVirtual) {
    parentRefStyle = {
      height: virtualHeight ?? 500,
      overflow: 'auto',
      position: 'relative',
    }
  }

  const parentRef = useRef<HTMLDivElement>(null)

  /**
   * Virtualization setup
   */
  const { density } = useEds()
  const estimateSize = useCallback(() => {
    return density === 'compact' ? 32 : 48
  }, [density])

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
  })
  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows.length ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length
    ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
    : 0

  // These classes are primarily used to allow for feature-detection in the test-suite
  const classList = {
    'sticky-header': !!stickyHeader,
    virtual: !!enableVirtual,
    paging: !!enablePagination,
  }

  return (
    <TableProvider
      cellClass={cellClass}
      cellStyle={cellStyle}
      rowClass={rowClass}
      rowStyle={rowStyle}
      headerClass={headerClass}
      headerStyle={headerStyle}
      table={table}
      enableSorting={!!enableSorting}
      enableColumnFiltering={!!enableColumnFiltering}
      stickyHeader={!!stickyHeader}
    >
      <div className="table-wrapper" style={parentRefStyle} ref={parentRef}>
        <Table
          className={Object.entries(classList)
            .filter(([, k]) => k)
            .map(([k]) => k)
            .join(' ')}
          {...{
            style: {
              width: table.getTotalSize(),
            },
          }}
        >
          {caption && <Table.Caption>{caption}</Table.Caption>}
          <Table.Head sticky={stickyHeader}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeaderRow
                key={headerGroup.id}
                table={table}
                headerGroup={headerGroup}
                columnResizeMode={columnResizeMode}
                deltaOffset={table.getState().columnSizingInfo.deltaOffset}
              />
            ))}
          </Table.Head>
          <Table.Body>
            {table.getRowModel().rows.length === 0 && emptyMessage && (
              <Table.Row>
                <Table.Cell colSpan={table.getHeaderGroups().length}>
                  {emptyMessage}
                </Table.Cell>
              </Table.Row>
            )}
            {enableVirtual && (
              <>
                <Table.Row
                  data-testid="virtual-padding-top"
                  className={'virtual-padding-top'}
                >
                  <Table.Cell
                    style={{
                      height: `${paddingTop}px`,
                    }}
                  ></Table.Cell>
                </Table.Row>

                {virtualRows.map((row) => (
                  <TableRow
                    key={row.index}
                    row={table.getRowModel().rows[row.index]}
                  />
                ))}
                <Table.Row
                  data-testid="virtual-padding-bottom"
                  className={'virtual-padding-bottom'}
                >
                  <Table.Cell
                    style={{
                      height: `${paddingBottom}px`,
                    }}
                  ></Table.Cell>
                </Table.Row>
              </>
            )}
            {!enableVirtual &&
              table
                .getRowModel()
                .rows.map((row) => <TableRow key={row.id} row={row} />)}
          </Table.Body>
        </Table>
        {enablePagination && (
          <div style={{ maxWidth: `${table.getTotalSize()}px` }}>
            <Pagination
              totalItems={table.getFilteredRowModel().rows.length}
              withItemIndicator={true}
              itemsPerPage={page.pageSize}
              onChange={(e, p) => setPage((s) => ({ ...s, pageIndex: p - 1 }))}
              defaultPage={1}
            />
          </div>
        )}
      </div>
      {debug && enableVirtual && (
        <span>
          Visible items: {virtualizer.range.startIndex} -{' '}
          {virtualizer.range.endIndex} / {rows.length}
        </span>
      )}
    </TableProvider>
  )
}
