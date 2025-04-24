/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pagination, Table, Typography, useEds } from '@equinor/eds-core-react'
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ForwardedRef,
} from 'react'
import styled from 'styled-components'
import { TableProvider } from './EdsDataGridContext'
import { EdsDataGridProps } from './EdsDataGridProps'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableFooterRow } from './components/TableFooterRow'
import { TableRow } from './components/TableRow'
import {
  addPxSuffixIfInputHasNoPrefix,
  logDevelopmentWarningOfPropUse,
} from './utils'
import { mergeRefs } from '@equinor/eds-utils'

function EdsDataGridInner<T>(
  {
    rows,
    columns,
    columnResizeMode,
    pageSize,
    rowSelection,
    enableRowSelection,
    enableMultiRowSelection,
    enableSubRowSelection,
    selectedRows,
    rowSelectionState,
    enableColumnFiltering,
    debug,
    enablePagination,
    enableSorting,
    stickyHeader,
    stickyFooter,
    onSelectRow,
    onRowSelectionChange,
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
    footerClass,
    footerStyle,
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
    tableInstanceRef,
    columnSizing,
    onColumnResize,
    expansionState,
    setExpansionState,
    getSubRows,
    defaultColumn,
    onRowContextMenu,
    onRowClick,
    onRowDoubleClick,
    onCellClick,
    enableFooter,
    enableSortingRemoval,
    ...rest
  }: EdsDataGridProps<T> & HTMLAttributes<HTMLDivElement>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  logDevelopmentWarningOfPropUse({
    virtualHeight: {
      value: virtualHeight,
      mitigationInfo: "Use 'height' instead.",
    },
    rowSelection: {
      value: rowSelection,
      mitigationInfo: "Use 'enableRowSelection' instead.",
    },
    onSelectRow: {
      value: onSelectRow,
      mitigationInfo: "Use 'onRowSelectionChange' instead.",
    },
    selectedRows: {
      value: selectedRows,
      mitigationInfo: "Use 'rowSelectionState' instead.",
    },
  })

  const [sorting, setSorting] = useState<SortingState>(sortingState ?? [])
  const [internalRowSelectionState, setInternalRowSelectionState] =
    useState<RowSelectionState>(rowSelectionState ?? selectedRows ?? {})
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
    if (virtualHeight) {
      console.warn(
        `virtualHeight prop is deprecated and will be removed in a later version. Please update your code to use height instead.`,
      )
    }
  }, [virtualHeight])

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
    setInternalRowSelectionState(rowSelectionState ?? selectedRows ?? {})
  }, [rowSelectionState, selectedRows])

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
    defaultColumn: defaultColumn ?? {
      size: 150,
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
            {/* eslint-disable-next-line @typescript-eslint/no-base-to-string */}
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
      rowSelection: internalRowSelectionState,
      columnOrder: columnOrderState,
      columnSizing: columnSizing ?? internalColumnSize,
      expanded: expansionState,
    },
    getSubRows: getSubRows,
    onExpandedChange: setExpansionState,
    getExpandedRowModel: getExpandedRowModel(),
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
    enableRowSelection: enableRowSelection ?? rowSelection ?? false,
    enableMultiRowSelection: enableMultiRowSelection ?? false,
    enableSubRowSelection: enableSubRowSelection ?? false,
    enableColumnPinning: true,
    enablePinning: true,
    getRowId,
    enableSortingRemoval: enableSortingRemoval ?? true,
  }

  useEffect(() => {
    if (columnOrder && columnOrder.length > 0) {
      setColumnOrderState(columnOrder ?? [])
    }
  }, [columnOrder])

  /**
   * Set up handlers for rowSelection
   */
  if (enableRowSelection ?? rowSelection ?? false) {
    options.onRowSelectionChange = (updaterOrValue) => {
      onSelectRow?.(updaterOrValue)
      onRowSelectionChange?.(updaterOrValue)

      setInternalRowSelectionState(updaterOrValue)
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
  if (tableInstanceRef) {
    tableInstanceRef.current = table
  }

  let tableWrapperStyle: CSSProperties = {}

  /**
   * Style the parent container to enable virtualization.
   * By not setting this, the virtual-scroll will always render every row, reducing computational overhead if turned off.
   */
  if (enableVirtual) {
    tableWrapperStyle = {
      height: height ?? virtualHeight ?? 500,
      overflow: 'auto',
      position: 'relative',
    }
  }

  const parentRef = useRef<HTMLDivElement>(null)
  const combinedRef = useMemo(
    () => mergeRefs<HTMLDivElement>(parentRef, ref),
    [parentRef, ref],
  )

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

  // Add effect to recalculate virtualization when density changes
  useEffect(() => {
    if (enableVirtual && virtualizer) {
      // Force the virtualizer to recalculate when density changes
      virtualizer.measure()
    }
  }, [density, enableVirtual, virtualizer])

  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows.length ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length
    ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
    : 0

  // These classes are primarily used to allow for feature-detection in the test-suite
  const classList = {
    'sticky-header': !!stickyHeader,
    'sticky-footer': !!stickyFooter,
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
      footerClass={footerClass}
      footerStyle={footerStyle}
      table={table}
      enableSorting={!!enableSorting}
      enableColumnFiltering={!!enableColumnFiltering}
      stickyHeader={!!stickyHeader}
      stickyFooter={!!stickyFooter}
    >
      <TableWrapper
        {...rest}
        className={`table-wrapper ${rest.className ?? ''}`}
        style={{ ...rest.style, ...tableWrapperStyle }}
        ref={combinedRef}
        $height={height}
        $width={width}
        $scrollbarHorizontal={scrollbarHorizontal}
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

                {virtualRows.map((virtualItem) => {
                  const row = table.getRowModel().rows[virtualItem.index]
                  return (
                    <TableRow
                      key={virtualItem.index}
                      row={row}
                      onContextMenu={
                        onRowContextMenu
                          ? (event) => onRowContextMenu(row, event)
                          : undefined
                      }
                      onClick={
                        onRowClick
                          ? (event) => onRowClick(row, event)
                          : undefined
                      }
                      onDoubleClick={
                        onRowDoubleClick
                          ? (event) => onRowDoubleClick(row, event)
                          : undefined
                      }
                      onCellClick={onCellClick}
                    />
                  )
                })}

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
                .rows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    onContextMenu={
                      onRowContextMenu
                        ? (event) => onRowContextMenu(row, event)
                        : undefined
                    }
                    onClick={
                      onRowClick ? (event) => onRowClick(row, event) : undefined
                    }
                    onCellClick={onCellClick}
                  />
                ))}
          </Table.Body>
          {enableFooter && (
            <Table.Foot sticky={stickyFooter} data-testid="eds-grid-footer">
              {table.getFooterGroups().map((footerGroup) => (
                <TableFooterRow
                  key={footerGroup.id}
                  table={table}
                  footerGroup={footerGroup}
                  columnResizeMode={columnResizeMode}
                  deltaOffset={table.getState().columnSizingInfo.deltaOffset}
                />
              ))}
            </Table.Foot>
          )}
        </Table>
        {externalPaginator
          ? externalPaginator
          : enablePagination && (
            <div className="table-pagination" style={{ maxWidth: `${table.getTotalSize()}px` }}>
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
      </TableWrapper>
      {debug && enableVirtual && (
        <span>
          Visible items: {virtualizer.range.startIndex} -{' '}
          {virtualizer.range.endIndex} / {rows.length}
        </span>
      )}
    </TableProvider>
  )
}

const TableWrapper = styled.div<{
  $height?: string | number
  $width?: string | number
  $scrollbarHorizontal?: boolean
}>`
  height: ${({ $height }) => addPxSuffixIfInputHasNoPrefix($height) ?? 'auto'};
  width: ${({ $scrollbarHorizontal, $width }) =>
    $scrollbarHorizontal
      ? (addPxSuffixIfInputHasNoPrefix($width) ?? '100%')
      : 'auto'};
  overflow: auto;
  contain: ${({ $height, $width }) =>
    Boolean($height) && Boolean($width) ? 'strict' : 'unset'};
`

export const EdsDataGrid = forwardRef(EdsDataGridInner) as <T>(
  props: EdsDataGridProps<T> &
    HTMLAttributes<HTMLDivElement> & {
      ref?: ForwardedRef<HTMLDivElement>
    },
) => ReturnType<typeof EdsDataGridInner>
