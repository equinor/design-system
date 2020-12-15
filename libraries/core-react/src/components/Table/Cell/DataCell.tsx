import * as React from 'react'
import { TdHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate, bordersTemplate, spacingsTemplate } from '@utils'
import { token as tablecell, TableCellToken } from './DataCell.tokens'
import { Variants } from '../Table.types'

const applyMutations = (
  variant: Variants,
  token: TableCellToken,
): TableCellToken => {
  switch (variant) {
    case 'numeric':
      return {
        ...token,
        typography: {
          ...token.typography,
          ...token.variants.numeric.typography,
        },
      }

    default:
      return token
  }
}

type BaseProps = {
  token: TableCellToken
}

const Base = ({ token }: BaseProps) => {
  const { background, height, typography, spacings, border } = token

  const base = css`
    min-height: ${height};
    height: ${height};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
    ${bordersTemplate(border)}
  `
  return base
}

const StyledTableCell = styled.td`
  ${Base}
`

type CellProps = {
  /** Specifies which variant to use */
  variant?: Variants
}

export const TableDataCell = ({
  children,
  variant = 'text',
  ...rest
}: CellProps & TdHTMLAttributes<HTMLTableDataCellElement>): JSX.Element => {
  const token = applyMutations(variant, tablecell)
  return (
    <StyledTableCell token={token} {...rest}>
      {children}
    </StyledTableCell>
  )
}

// Cell.displayName = 'eds-table-cell'
