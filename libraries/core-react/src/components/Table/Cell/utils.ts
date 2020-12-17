import { TableCellToken } from './DataCell.tokens'
import { TableHeadToken } from './HeaderCell.tokens'
import { Density } from '../Table.types'

type Cell = TableCellToken | TableHeadToken

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
