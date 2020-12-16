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
  color?: Colors
}

const Base = ({ token, color }: BaseProps) => {
  const { height, typography, spacings, border } = token

  const backgroundColor =
    color === 'error' ? token.validation.error?.background : ''

  const base = css`
    min-height: ${height};
    height: ${height};
    background: ${backgroundColor};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
    ${bordersTemplate(border)}
  `
  return base
}

const StyledTableCell = styled.td`
  ${Base}
`

type Colors = 'error'

type CellProps = {
  /** Specifies which variant to use */
  variant?: Variants
  /** Specifies cell background color */
  color?: Colors
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
