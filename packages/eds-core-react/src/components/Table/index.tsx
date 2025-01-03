'use client'
import { Table as BaseTable, TableProps } from './Table'
import { Body, BodyProps } from './Body'
import { Cell, CellProps } from './Cell'
import { Head, HeadProps } from './Head'
import { Foot, FootProps } from './Foot'
import { Row, RowProps } from './Row'
import { Caption, CaptionProps } from './Caption'

type TableCompoundProps = typeof BaseTable & {
  Body: typeof Body
  Cell: typeof Cell
  Head: typeof Head
  Foot: typeof Foot
  Row: typeof Row
  Caption: typeof Caption
}

const Table = BaseTable as TableCompoundProps

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Foot = Foot
Table.Row = Row
Table.Caption = Caption

Table.Body.displayName = 'Table.Body'
Table.Cell.displayName = 'Table.Cell'
Table.Head.displayName = 'Table.Head'
Table.Foot.displayName = 'Table.Foot'
Table.Row.displayName = 'Table.Row'
Table.Caption.displayName = 'Table.Caption'

export { Table }
export type {
  TableProps,
  CellProps,
  BodyProps,
  RowProps,
  CaptionProps,
  HeadProps,
  FootProps,
}
