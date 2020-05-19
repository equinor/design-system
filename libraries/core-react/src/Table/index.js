import { Table as TableComponent } from './Table'
import { Body } from './Body'
import { Cell } from './Cell'
import { Head } from './Head'
import { Row } from './Row'

/**
 * @type {typeof import('./types').Table}
 */
// @ts-ignore
const Table = TableComponent

Table.Body = Body
Table.Cell = Cell
Table.Head = Head
Table.Row = Row

export { Table }
