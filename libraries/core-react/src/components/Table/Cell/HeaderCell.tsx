import * as React from 'react'
import { ThHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate, spacingsTemplate, bordersTemplate } from '@utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'
import { useTable } from '../Table.context'
import { applyDensity } from './utils'

type BaseProps = {
  token: TableHeadToken
  sticky?: boolean
} & Pick<React.AriaAttributes, 'aria-sort'>

const Base = (props: BaseProps) => {
  const { token, sticky } = props
  const { background, height, typography, spacings } = token
  const activeToken = token.states.active
  const ariaSort = props['aria-sort']
  let sortStylingHover = css({})
  let sortStylingActive = css({})

  if (ariaSort) {
    sortStylingHover = css`
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          cursor: pointer;
          background: ${token.states.hover.background};
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

  const base = css`
    min-height: ${height};
    height: ${height};
    background: ${background};
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
    ${bordersTemplate(token.border)}
    ${sortStylingHover}
    ${sortStylingActive}

    ${sticky
      ? css`
          position: sticky;
          top: 0;
        `
      : ''}
  `

  return base
}

const StyledTableCell = styled.th`
  ${Base}
`

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
  const { density } = useTable()
  const token = applyDensity(density, tablehead)

  return (
    <StyledTableCell token={token} aria-sort={sort} {...rest} ref={ref}>
      <CellInner>{children}</CellInner>
    </StyledTableCell>
  )
})
