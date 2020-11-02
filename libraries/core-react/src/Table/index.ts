import { Table as BaseComponent } from './Table'
import { Body } from './Body'
import { Cell } from './Cell'
import { Head } from './Head'
import { Row } from './Row'

type TableProps = typeof BaseComponent & {
  Body: typeof Body
  Cell: typeof Cell
  Head: typeof Head
  Row: typeof Row
}

const Table = BaseComponent as TableProps

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Row = Row

export { Table, TableProps }
