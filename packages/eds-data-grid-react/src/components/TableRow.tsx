import { Table } from '@equinor/eds-core-react'
import { Row } from '@tanstack/react-table'
import { TableBodyCell } from './TableBodyCell'
import { HTMLAttributes } from 'react'
import { useTableContext } from '../EdsDataGridContext'

type Props<T> = {
  row: Row<T>
} & HTMLAttributes<HTMLTableRowElement>

export function TableRow<T>({ row }: Props<T>) {
  const { rowClass, rowStyle } = useTableContext()
  return (
    <Table.Row
      style={{
        cursor: row.getCanSelect() ? 'pointer' : 'inherit',
        ...(rowStyle?.(row) ?? {}),
      }}
      className={`${row.getIsSelected() ? 'selected' : ''} ${rowClass?.(row)}`}
      onClick={() => (row.getCanSelect() ? row.toggleSelected() : null)}
    >
      {row.getVisibleCells().map((cell) => (
        <TableBodyCell key={cell.id} cell={cell} />
      ))}
    </Table.Row>
  )
}
