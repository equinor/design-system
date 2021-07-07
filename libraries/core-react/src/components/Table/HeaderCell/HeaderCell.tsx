import { ThHTMLAttributes, forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../../utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'
import { useEds } from '../../EdsProvider'
import { useToken } from '../../../hooks'

type BaseProps = {
  theme: TableHeadToken
  sticky?: boolean
} & Pick<React.AriaAttributes, 'aria-sort'>

const StyledTableCell = styled.th((props: BaseProps) => {
  const { theme, sticky } = props
  const { background, height, typography, spacings } = theme
  const activeToken = theme.states.active
  const ariaSort = props['aria-sort']
  let sortStylingHover = css({})
  let sortStylingActive = css({})

  if (ariaSort) {
    sortStylingHover = css`
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          cursor: pointer;
          background: ${theme.states.hover.background};
        }
      }
    `
  }

  if (ariaSort && ariaSort !== 'none') {
    sortStylingActive = css`
      ${activeToken.border.type === 'bordergroup'
        ? css`
            border-color: ${activeToken.border.bottom.color};
          `
        : ''};
      background: ${activeToken.background};
      color: ${activeToken.typography.color};
    `
  }

  return css`
    min-height: ${height};
    height: ${height};
    background: ${background};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
  ${bordersTemplate(theme.border)}
  ${sortStylingHover}
  ${sortStylingActive}

  ${sticky
      ? css`
          position: sticky;
          top: 0;
        `
      : ''}
  `
})

const CellInner = styled.div`
  display: flex;
  align-items: center;
`

type CellProps = {
  sort?: React.AriaAttributes['aria-sort']
  sticky?: boolean
} & ThHTMLAttributes<HTMLTableHeaderCellElement>

export const TableHeaderCell = forwardRef<
  HTMLTableHeaderCellElement,
  CellProps
>(function TableHeaderCell({ children, sort, ...rest }, ref) {
  const { density } = useEds()
  const token = useToken({ density }, tablehead)()

  return (
    <ThemeProvider theme={token}>
      <StyledTableCell aria-sort={sort} {...rest} ref={ref}>
        <CellInner>{children}</CellInner>
      </StyledTableCell>
    </ThemeProvider>
  )
})
