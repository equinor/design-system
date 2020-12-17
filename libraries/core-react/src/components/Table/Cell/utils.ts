import { TableCellToken } from './DataCell.tokens'
import { TableHeadToken } from './HeaderCell.tokens'
import { Density } from '../Table.types'

type Cell = TableCellToken | TableHeadToken
type ApplyDensity<T> = (density: Density, token: Partial<Cell>) => T

export const applyDensity = <T extends Cell>(density: Density, token: T): T => {
  switch (density) {
    case 'compact':
      return {
        ...token,
        height: token.density.compact.height,
      }
    default:
      return token
  }
}
