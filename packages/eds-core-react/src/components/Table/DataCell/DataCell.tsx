import { TdHTMLAttributes, forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  bordersTemplate,
  spacingsTemplate,
  useToken,
} from '@equinor/eds-utils'
import { tableCell, TableCellToken, applyVariant } from './DataCell.tokens'
import { Variants, Colors } from '../Table.types'
import { useEds } from '../../EdsProvider'

type BaseProps = {
  theme: TableCellToken
  color?: Colors
}

const StyledTableCell = styled.td(({ theme, color }: BaseProps) => {
  const { height, typography, spacings, border, align } = theme

  const backgroundColor =
    color === 'error' ? theme.validation.error?.background : ''

  const base = css`
    min-height: ${height};
    height: ${height};
    background: ${backgroundColor};
    vertical-align: ${align.vertical};
    box-sizing: border-box;
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
    ${bordersTemplate(border)}
    a {
      font-size: inherit;
      font-weight: inherit;
    }
  `
  return base
})

type CellProps = {
  /** Specifies which variant to use */
  variant?: Variants
  /** Specifies cell background color */
  color?: Colors
} & TdHTMLAttributes<HTMLTableCellElement>

export const TableDataCell = forwardRef<HTMLTableCellElement, CellProps>(
  function TableDataCell({ children, variant = 'text', ...rest }, ref) {
    const { density } = useEds()
    const token = useToken({ density }, applyVariant(variant, tableCell))

    return (
      <ThemeProvider theme={token}>
        <StyledTableCell {...rest} ref={ref}>
          {children}
        </StyledTableCell>
      </ThemeProvider>
    )
  },
)
