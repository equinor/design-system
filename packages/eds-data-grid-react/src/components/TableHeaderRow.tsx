import { Table } from '@equinor/eds-core-react'
import {
  ColumnResizeMode,
  HeaderGroup,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { TableHeaderCell } from './TableHeaderCell'

type Props<T> = {
  headerGroup: HeaderGroup<T>
  columnResizeMode?: ColumnResizeMode | null
  deltaOffset: number | null
  table: TanStackTable<any>
}

export function TableHeaderRow<T>({
  headerGroup,
  columnResizeMode,
  deltaOffset,
  table,
}: Props<T>) {
  return (
    <Table.Row>
      {headerGroup.headers.map((header) => (
        <TableHeaderCell
          header={header}
          key={header.id}
          table={table}
          columnResizeMode={columnResizeMode}
          deltaOffset={deltaOffset}
        />
      ))}
    </Table.Row>
  )
}
