import { Cell, flexRender } from '@tanstack/react-table'
import { Table, Typography } from '@equinor/eds-core-react'
import { useTableContext } from '../EdsDataGridContext'

type Props<T> = {
  cell: Cell<T, unknown>
}
export function TableBodyCell<T>({ cell }: Props<T>) {
  const { cellClass, cellStyle } = useTableContext()
  return (
    <Table.Cell
      className={cellClass ? cellClass(cell.row, cell.column.id) : ''}
      {...{
        key: cell.id,
        style: {
          width: cell.column.getSize(),
          maxWidth: cell.column.getSize(),
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          ...(cellStyle?.(cell.row, cell.column.id) ?? {}),
        },
      }}
    >
      <Typography as="span" group="table" variant="cell_text">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Typography>
    </Table.Cell>
  )
}
