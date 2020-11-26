import * as React from 'react'
import { ThHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate, spacingsTemplate } from '@utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'

type BaseProps = {
  token: TableHeadToken
}

const Base = ({ token }: BaseProps) => {
  const { background, height, typography, spacings, border } = token

  const base = css`
    min-height: ${height};
    height: ${height};
    background: ${background};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
  `
  return base
}

const StyledTableCell = styled.th`
  ${Base}
`

type CellProps = {} & ThHTMLAttributes<HTMLTableHeaderCellElement>

export const TableHeaderCell = ({
  children,
  ...rest
}: CellProps): JSX.Element => {
  return (
    <StyledTableCell token={tablehead} {...rest}>
      {children}
    </StyledTableCell>
  )
}

// Cell.displayName = 'eds-table-cell'
