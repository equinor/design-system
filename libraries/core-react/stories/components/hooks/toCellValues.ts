import { Data, Column } from '../helpers/data'

export const toCellValues = (data: Data[], columns: Column[]): string[][] =>
  data.map((item) =>
    columns.map((column) =>
      typeof item[column.accessor] !== 'undefined'
        ? (item[column.accessor] as string)
        : '',
    ),
  )
