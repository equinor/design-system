import { Table as BaseComponent, TableProps } from './Table'
import { Body } from './Body'
import { Cell } from './Cell'
import { Head } from './Head'
import { Row } from './Row'

type TableCompoundProps = typeof BaseComponent & {
  Body: typeof Body
  Cell: typeof Cell
  Head: typeof Head
  Row: typeof Row
}

const Table = BaseComponent as TableCompoundProps

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Row = Row

export { Table }
export type { TableProps }
