import { createContext, CSSProperties, ReactElement, useContext } from 'react'
import { Column, Row, Table as TanStackTable } from '@tanstack/react-table'

type Context<T> = {
  enableSorting: boolean
  stickyHeader: boolean
  stickyFooter: boolean
  enableColumnFiltering: boolean
  table: TanStackTable<T> | null
  cellClass?: (row: Row<T>, columnId: string) => string
  rowClass?: (row: Row<T>) => string
  cellStyle?: (row: Row<T>, columnId: string) => CSSProperties
  rowStyle?: (row: Row<T>) => CSSProperties
  headerClass?: (column: Column<T>) => string
  headerStyle?: (column: Column<T>) => CSSProperties
  footerClass?: (column: Column<T>) => string
  footerStyle?: (column: Column<T>) => CSSProperties
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EdsDataGridContext = createContext<Context<any>>({
  enableSorting: false,
  stickyHeader: false,
  stickyFooter: false,
  enableColumnFiltering: false,
  table: null,
})

export function TableProvider<T>({
  children,
  ...props
}: Context<T> & { children: ReactElement | ReactElement[] }) {
  return (
    <EdsDataGridContext.Provider value={props}>
      {children}
    </EdsDataGridContext.Provider>
  )
}

export const useTableContext = () => useContext(EdsDataGridContext)
