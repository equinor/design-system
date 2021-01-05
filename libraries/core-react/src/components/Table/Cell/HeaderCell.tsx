import * as React from 'react'
import { ThHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate, spacingsTemplate } from '@utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'
import { useTable } from '../Table.context'
import { applyDensity } from './utils'

type BaseProps = {
  token: TableHeadToken
  'aria-sort'?: React.AriaAttributes['aria-sort']
}

const Base = (props: BaseProps) => {
  const { token } = props
  const { background, height, typography, spacings } = token

  const base = css`
    min-height: ${height};
    height: ${height};
    background: ${background};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}

    &:hover {
      ${props['aria-sort']
        ? css`
            background: ${token.states.hover.background};
          `
        : ''}
    }
  `
  return base
}

const StyledTableCell = styled.th`
  ${Base}
`

type CellProps = {
  sortDirection?: React.AriaAttributes['aria-sort']
} & ThHTMLAttributes<HTMLTableHeaderCellElement>

export const TableHeaderCell = ({
  children,
  sortDirection,
  ...rest
}: CellProps): JSX.Element => {
  const { density } = useTable()
  const token = applyDensity(density, tablehead)

  return (
    <StyledTableCell token={token} aria-sort={sortDirection} {...rest}>
      {children}
    </StyledTableCell>
  )
}

// Cell.displayName = 'eds-table-cell'
