import * as React from 'react'
import { ThHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import * as R from 'ramda'
import { typographyTemplate, bordersTemplate, spacingsTemplate } from '@utils'
import { token as tablehead, TableHeadToken } from '../TableHead.tokens'
import { Variants } from '../Table.types'

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

const StyledTableCell = styled.td`
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
