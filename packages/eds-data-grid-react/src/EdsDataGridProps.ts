import {
  Cell,
  Column,
  ColumnDef,
  ColumnPinningState,
  ColumnResizeMode,
  ColumnSizingState,
  ExpandedState,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  TableOptions,
} from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import {
  CSSProperties,
  MouseEvent,
  MutableRefObject,
  ReactElement,
} from 'react'

type BaseProps<T> = {
  /**
   * The rows to display in the table
   */
  rows: Array<T>
  /**
   * Definition of the columns to display in the table
   */

  columns: TableOptions<T>['columns']
  /**
   * The mode of column resizing. If not set, column resizing is disabled.
   * Can be either 'onChange' or 'onEnd'
   * @default undefined
   */
  columnResizeMode?: ColumnResizeMode
  /**
   * Enable debug mode. See https://tanstack.com/table/v8/docs/api/core/table#debugall
   * @default false
   */
  debug?: boolean
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
   * The message to display when there are no rows
   * @default undefined
   */
  emptyMessage?: string
  /**
   * Whether there should be horizontal scrolling.
   * This must be true for column pinning to work
   * @default true
   */
  scrollbarHorizontal?: boolean
  /**
   * Width of the table. Only takes effect if {@link scrollbarHorizontal} is true.
   *
   * No suffix (like `px` or `rem`) equals to `px`.
   * @default 800
   */
  width?: string | number
  /**
   * Min width of the table element.
   *
   * @example minWidth: 800
   * @default none
   */
  minWidth?: string | number
  /**
   * Height of the table.
   *
   * No suffix (like `px` or `rem`) equals to `px`.
   * @default none
   */
  height?: string | number
  /**
   * This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.
   * @example getRowId: row => row.userId
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getRowId?: TableOptions<T>['getRowId']
  /**
   * Optional prop to override the default column setup (cell, header, size etc.)
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)
   */
  defaultColumn?: Partial<ColumnDef<T, unknown>>
}

type RowSelectionProps<T> = {
  /**
   * Set this to enable rowSelection. If a function is provided, it will be called for each row to determine if it is selectable.
   * @default false
   */
  enableRowSelection?: boolean | ((row: Row<T>) => boolean)
  /**
   * Only used if row selection has been enabled via `enableRowSelection`
   * Enables/disables multiple row selection for all rows in the table OR
   * A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren
   * @default false
   */
  enableMultiRowSelection?: boolean | ((row: Row<T>) => boolean)
  /** 
   * Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection 
   * @link https://tanstack.com/table/v8/docs/api/features/row-selection#enablesubrowselection
   * @default false
   */
  enableSubRowSelection?: boolean | ((row: Row<T>) => boolean)
  /**
   * The currently selected rows
   * @deprecated Use `rowSelectionState`
   * @default {}
   */
  selectedRows?: Record<string | number, boolean>
  /**
   * The currently selected rows
   * @default {}
   */
  rowSelectionState?: RowSelectionState
  /**
   * Set this to enable rowSelection. If a function is provided, it will be called for each row to determine if it is selectable.
   * @deprecated Use `enableRowSelection`
   * @default false
   */
  rowSelection?: boolean | ((row: Row<T>) => boolean)
  /**
   * Callback for when row-selection changes
   * @deprecated Use `onRowSelectionChange`
   */
  onSelectRow?: OnChangeFn<RowSelectionState>
  /**
   * Callback for when row-selection changes
   */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

type StyleProps<T> = {
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

type FilterProps = {
  /**
   * Whether to enable column filtering, adding inputs to the header cells
   * Individual columns can be configured to disable filtering
   * @default false
   */
  enableColumnFiltering?: boolean
}

type HandlersProps<T> = {
  /**
   * Row click handler.
   *
   * @param row The current row
   * @param event The click event
   * @returns
   */
  onRowClick?: (row: Row<T>, event: MouseEvent<HTMLTableRowElement>) => unknown
  /**
   * Cell click handler.
   *
   * @param cell The current cell
   * @param event The click event
   * @returns
   */
  onCellClick?: (
    cell: Cell<T, unknown>,
    event: MouseEvent<HTMLTableCellElement>,
  ) => unknown
}

type PagingProps = {
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
   * Add this if you want to implement a custom pagination component
   * Useful for e.g server-side paging
   */
  externalPaginator?: ReactElement
}

type VirtualProps = {
  /**
   * Whether to enable virtualization. This will render only the visible rows currently in view.
   * @default false
   */
  enableVirtual?: boolean
  /**
   * The height of the virtualized table in pixels.
   * @deprecated Use `height` prop over virtualHeight, this will be removed in a later version
   * @default 500
   */
  virtualHeight?: number
}

type SortProps = {
  /**
   * Enable sorting.
   * @default false
   */
  enableSorting?: boolean
  /**
   * Method to call when sorting changes
   */
  onSortingChange?: OnChangeFn<SortingState>
  /**
   * Enable manual sorting, useful for server-side sorting.
   * @default false
   */
  manualSorting?: boolean
  /**
   * Override the default sorting state
   */
  sortingState?: SortingState
}

type ColumnProps = {
  columnPinState?: ColumnPinningState
  columnSizing?: ColumnSizingState
  onColumnResize?: (e: ColumnSizingState) => void
}

type RefProps = {
  rowVirtualizerInstanceRef?: MutableRefObject<Virtualizer<
    HTMLDivElement,
    Element
  > | null>
}

type ExpansionProps<T> = {
  expansionState?: ExpandedState
  setExpansionState?: React.Dispatch<React.SetStateAction<ExpandedState>>
  getSubRows?: (row: T, rowIndex: number) => Array<T>
}

export type EdsDataGridProps<T> = BaseProps<T> &
  RowSelectionProps<T> &
  StyleProps<T> &
  HandlersProps<T> &
  SortProps &
  FilterProps &
  PagingProps &
  ColumnProps &
  VirtualProps &
  RefProps &
  ExpansionProps<T> & {
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
  }
