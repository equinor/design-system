import { TdHTMLAttributes, forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  bordersTemplate,
  spacingsTemplate,
} from '../../../utils'
import { tableCell, TableCellToken, applyVariant } from './DataCell.tokens'
import { Variants, Colors } from '../Table.types'
import { useEds } from '../../EdsProvider'
import { useToken } from '../../../hooks'

type BaseProps = {
  theme: TableCellToken
  color?: Colors
}

const StyledTableCell = styled.td(({ theme, color }: BaseProps) => {
  const { height, typography, spacings, border } = theme

  const backgroundColor =
    color === 'error' ? theme.validation.error?.background : ''

  const base = css`
    min-height: ${height};
    height: ${height};
    background: ${backgroundColor};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
    ${bordersTemplate(border)}
  `
  return base
})

type CellProps = {
  /** Specifies which variant to use */
  variant?: Variants
  /** Specifies cell background color */
  color?: Colors
} & TdHTMLAttributes<HTMLTableDataCellElement>

export const TableDataCell = forwardRef<HTMLTableDataCellElement, CellProps>(
  function TableDataCell({ children, variant = 'text', ...rest }, ref) {
    const { density } = useEds()
    const token = useToken({ density }, applyVariant(variant, tableCell))()

    return (
      <ThemeProvider theme={token}>
        <StyledTableCell {...rest} ref={ref}>
          {children}
        </StyledTableCell>
      </ThemeProvider>
    )
  },
)
