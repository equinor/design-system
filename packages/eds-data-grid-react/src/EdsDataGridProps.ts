import {
  Column,
  ColumnDef,
  ColumnResizeMode,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import { CSSProperties, ReactElement } from 'react'

type BaseProps<T> = {
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
   * The currently selected rows
   * @default {}
   */
  selectedRows?: Record<string | number, boolean>
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

export type EdsDataGridProps<T> = BaseProps<T> &
  StyleProps<T> &
  SortProps &
  FilterProps &
  PagingProps &
  VirtualProps & {
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
