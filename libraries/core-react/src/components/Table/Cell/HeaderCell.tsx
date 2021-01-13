import * as React from 'react'
import { ThHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate, spacingsTemplate, bordersTemplate } from '@utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'
import { useTable } from '../Table.context'
import { applyDensity } from './utils'

type BaseProps = {
  token: TableHeadToken
} & Pick<React.AriaAttributes, 'aria-sort'>

const Base = (props: BaseProps) => {
  const { token } = props
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
} & ThHTMLAttributes<HTMLTableHeaderCellElement>

export const TableHeaderCell = ({
  children,
  sort,
  ...rest
}: CellProps): JSX.Element => {
  const { density } = useTable()
  const token = applyDensity(density, tablehead)

  return (
    <StyledTableCell token={token} aria-sort={sort} {...rest}>
      <CellInner>{children}</CellInner>
    </StyledTableCell>
  )
}
