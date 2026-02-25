import { ThHTMLAttributes, forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
  useToken,
} from '@equinor/eds-utils'
import {
  token as tableFoot,
  TableHeadToken as TableFootToken,
} from './../HeaderCell/HeaderCell.tokens' // Use Header cell tokens as default
import { useEds } from '../../EdsProvider'

type BaseProps = {
  theme: TableFootToken
  $sticky: boolean
}

const StyledTableCell = styled.th((props: BaseProps) => {
  const { theme, $sticky } = props
  const { background, height, typography, spacings } = theme

  return css`
    min-height: ${height};
    height: ${height};
    background: ${background};
    box-sizing: border-box;
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
  ${bordersTemplate(theme.border)}
  a {
    font-size: inherit;
    font-weight: inherit;
  }
  ${$sticky
      ? css`
          position: sticky;
          bottom: 0;
          z-index: 2;
        `
      : ''}
  `
})

const CellInner = styled.div`
  display: flex;
  align-items: center;
`

type CellProps = {
  sticky?: boolean
} & ThHTMLAttributes<HTMLTableCellElement>

export const TableFooterCell = forwardRef<HTMLTableCellElement, CellProps>(
  function TableFooterCell({ children, sticky, ...rest }, ref) {
    const { density } = useEds()
    const token = useToken({ density }, tableFoot)
    const props = {
      ref,
      $sticky: sticky,
      ...rest,
    }

    return (
      <ThemeProvider theme={token}>
        <StyledTableCell {...props}>
          <CellInner>{children}</CellInner>
        </StyledTableCell>
      </ThemeProvider>
    )
  },
)
