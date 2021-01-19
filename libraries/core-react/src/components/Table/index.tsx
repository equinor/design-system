import { Table as BaseTable, TableProps } from './Table'
import { Body, BodyProps } from './Body'
import { Cell, CellProps } from './Cell'
import { Head } from './Head'
import { Row, RowProps } from './Row'
import { Caption, CaptionProps } from './Caption'

type TableCompoundProps = typeof BaseTable & {
  Body: typeof Body
  Cell: typeof Cell
  Head: typeof Head
  Row: typeof Row
  Caption: typeof Caption
}

const Table = BaseTable as TableCompoundProps

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Row = Row
Table.Caption = Caption

export { Table }
export type { TableProps }
export type { CellProps }
export type { BodyProps }
export type { RowProps }
export type { CaptionProps }
