import * as React from 'react'
import { FC } from 'react'
import { Table as BaseTable, TableProps } from './Table'
import { Body } from './Body'
import { Cell } from './Cell'
import { Head } from './Head'
import { Row } from './Row'
import { Caption } from './Caption'
import { TableProvider } from './Table.context'

const TableWrapper: FC<TableProps> = (props) => (
  <TableProvider>
    <BaseTable {...props}></BaseTable>
  </TableProvider>
)

type TableCompoundProps = typeof BaseTable & {
  Body: typeof Body
  Cell: typeof Cell
  Head: typeof Head
  Row: typeof Row
  Caption: typeof Caption
}

const Table = TableWrapper as TableCompoundProps

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Row = Row
Table.Caption = Caption

export { Table }
export type { TableProps }
