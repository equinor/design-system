/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pagination, Table, Typography, useEds } from '@equinor/eds-core-react'
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableRow } from './components/TableRow'
import { TableProvider } from './EdsDataGridContext'
import { EdsDataGridProps } from './EdsDataGridProps'

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
  externalPaginator,
  onSortingChange,
  manualSorting,
  sortingState,
  columnPinState,
  scrollbarHorizontal,
  width,
  minWidth,
  height,
  getRowId,
  rowVirtualizerInstanceRef,
  columnSizing,
  onColumnResize,
}: EdsDataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(sortingState ?? [])
  const [selection, setSelection] = useState<RowSelectionState>(
    selectedRows ?? {},
  )
  const [columnPin, setColumnPin] = useState<ColumnPinningState>(
    columnPinState ?? {},
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [internalColumnSize, setInternalColumnSize] =
    useState<ColumnSizingState>(columnSizing ?? {})
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

  useEffect(() => {
    setColumnPin((s) => columnPinState ?? s)
  }, [columnPinState])

  useEffect(() => {
    setSorting(sortingState)
  }, [sortingState])

  useEffect(() => {
    setSelection(selectedRows ?? {})
  }, [selectedRows])

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
                Number(value) >= (isNaN(start) ? 0 : start) &&
                Number(value) <= (!end || isNaN(end) ? Infinity : end)
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
    defaultColumn: {
      cell: (context) => {
        return (
          <Typography
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            group="table"
            variant="cell_text"
          >
            {String(context.getValue() ?? '')}
          </Typography>
        )
      },
    },
    columnResizeMode: columnResizeMode,
    onColumnSizingChange: (change) => {
      if (typeof change === 'function') {
        setInternalColumnSize(change(internalColumnSize))
      } else {
        setInternalColumnSize(change)
      }
      if (onColumnResize) {
        onColumnResize(internalColumnSize)
      }
    },
    state: {
      sorting,
      columnPinning: columnPin,
      rowSelection: selection,
      columnOrder: columnOrderState,
      columnSizing: columnSizing ?? internalColumnSize,
    },
    onSortingChange: (changes) => {
      if (onSortingChange) {
        onSortingChange(changes)
      }
      setSorting(changes)
    },
    enableColumnFilters: !!enableColumnFiltering,
    enableFilters: !!enableColumnFiltering,
    enableSorting: enableSorting ?? false,
    manualSorting: manualSorting ?? false,
    enableColumnResizing: !!columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: debug,
    debugHeaders: debug,
    debugColumns: debug,
    enableRowSelection: rowSelection ?? false,
    enableColumnPinning: true,
    enablePinning: true,
    getRowId,
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
      height: height ?? virtualHeight ?? 500,
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
  if (rowVirtualizerInstanceRef) rowVirtualizerInstanceRef.current = virtualizer

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
      <div
        className="table-wrapper"
        style={{
          height: height ?? 'auto',
          ...parentRefStyle,
          width: scrollbarHorizontal ? width ?? '100%' : 'auto',
          overflow: 'auto',
        }}
        ref={parentRef}
      >
        <Table
          className={Object.entries(classList)
            .filter(([, k]) => k)
            .map(([k]) => k)
            .join(' ')}
          {...{
            style: {
              tableLayout: scrollbarHorizontal ? 'fixed' : 'auto',
              width: table.getTotalSize(),
              minWidth: scrollbarHorizontal ? minWidth : 'auto',
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
          <Table.Body style={{ backgroundColor: 'inherit' }}>
            {table.getRowModel().rows.length === 0 && emptyMessage && (
              <Table.Row>
                <Table.Cell colSpan={table.getFlatHeaders().length}>
                  {emptyMessage}
                </Table.Cell>
              </Table.Row>
            )}
            {enableVirtual && (
              <>
                {paddingTop > 0 && (
                  <Table.Row
                    data-testid="virtual-padding-top"
                    className={'virtual-padding-top'}
                    style={{ pointerEvents: 'none' }}
                  >
                    <Table.Cell
                      style={{
                        height: `${paddingTop}px`,
                      }}
                    />
                  </Table.Row>
                )}

                {virtualRows.map((row) => (
                  <TableRow
                    key={row.index}
                    row={table.getRowModel().rows[row.index]}
                  />
                ))}

                {paddingBottom > 0 && (
                  <Table.Row
                    data-testid="virtual-padding-bottom"
                    className={'virtual-padding-bottom'}
                    style={{ pointerEvents: 'none' }}
                  >
                    <Table.Cell
                      style={{
                        height: `${paddingBottom}px`,
                      }}
                    />
                  </Table.Row>
                )}
              </>
            )}
            {!enableVirtual &&
              table
                .getRowModel()
                .rows.map((row) => <TableRow key={row.id} row={row} />)}
          </Table.Body>
        </Table>
        {externalPaginator
          ? externalPaginator
          : enablePagination && (
              <div style={{ maxWidth: `${table.getTotalSize()}px` }}>
                <Pagination
                  totalItems={table.getFilteredRowModel().rows.length}
                  withItemIndicator={true}
                  itemsPerPage={page.pageSize}
                  onChange={(e, p) =>
                    setPage((s) => ({ ...s, pageIndex: p - 1 }))
                  }
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
