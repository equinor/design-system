import { Table } from '@equinor/eds-core-react'
import {
  ColumnResizeMode,
  HeaderGroup,
  Table as TanStackTable,
} from '@tanstack/react-table'
import { TableFooterCell } from './TableFooterCell'

type Props<T> = {
  footerGroup: HeaderGroup<T>
  columnResizeMode?: ColumnResizeMode | null
  deltaOffset: number | null
  table: TanStackTable<T>
}

export function TableFooterRow<T>({
  footerGroup,
  columnResizeMode,
  deltaOffset,
  table,
}: Props<T>) {
  return (
    <Table.Row>
      {footerGroup.headers.map((footer) => (
        <TableFooterCell
          footer={footer}
          key={footer.id}
          table={table}
          columnResizeMode={columnResizeMode}
          deltaOffset={deltaOffset}
        />
      ))}
    </Table.Row>
  )
}
