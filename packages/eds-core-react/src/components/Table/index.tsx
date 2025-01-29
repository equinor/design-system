import { Table as BaseTable, TableProps } from './Table'
import { Body as TableBody, BodyProps } from './Body'
import { Cell as TableCell, CellProps } from './Cell'
import { Head as TableHead, HeadProps } from './Head'
import { Foot as TableFoot, FootProps } from './Foot'
import { Row as tableRow, RowProps } from './Row'
import { Caption as TableCaption, CaptionProps } from './Caption'

type TableCompoundProps = typeof BaseTable & {
  Body: typeof TableBody
  Cell: typeof TableCell
  Head: typeof TableHead
  Foot: typeof TableFoot
  Row: typeof tableRow
  Caption: typeof TableCaption
}

const Table = BaseTable as TableCompoundProps

Table.Body = TableBody
Table.Cell = TableCell
Table.Head = TableHead
Table.Foot = TableFoot
Table.Row = tableRow
Table.Caption = TableCaption

Table.Body.displayName = 'Table.Body'
Table.Cell.displayName = 'Table.Cell'
Table.Head.displayName = 'Table.Head'
Table.Foot.displayName = 'Table.Foot'
Table.Row.displayName = 'Table.Row'
Table.Caption.displayName = 'Table.Caption'

export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFoot,
  tableRow,
  TableCaption,
}
export type {
  TableProps,
  CellProps,
  BodyProps,
  RowProps,
  CaptionProps,
  HeadProps,
  FootProps,
}
