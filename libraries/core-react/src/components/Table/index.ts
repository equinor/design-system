import { Table as BaseComponent, TableProps } from './Table'
import { Body } from './Body'
import { Cell } from './Cell'
import { Head } from './Head'
import { Row } from './Row'
import { Caption } from './Caption'

type TableCompoundProps = typeof BaseComponent & {
  Body: typeof Body
  Cell: typeof Cell
  Head: typeof Head
  Row: typeof Row
  Caption: typeof Caption
}

const Table = BaseComponent as TableCompoundProps

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Row = Row
Table.Caption = Caption

export { Table }
export type { TableProps }
