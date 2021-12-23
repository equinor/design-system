import { Data, Column } from './data'

export const toCellValues = (data: Data[], columns: Column[]): string[][] =>
  data.map((item) =>
    columns.map((column) =>
      typeof item[column.accessor] !== 'undefined'
        ? (item[column.accessor] as string)
        : '',
    ),
  )
