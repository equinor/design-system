import * as React from 'react'
import * as R from 'ramda'

import { ThHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate, spacingsTemplate, bordersTemplate } from '@utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'
import { useTable } from '../Table.context'
import { applyDensity } from './utils'

type BaseProps = {
  token: TableHeadToken
  'aria-sort'?: React.AriaAttributes['aria-sort']
}

const Base = (props: BaseProps) => {
  const { token } = props
  const { background, height, typography, spacings } = token
  let sortStylingHover = css({})
  let sortStylingActive = css({})

  if (props['aria-sort']) {
    sortStylingHover = css`
      &:hover {
        background: ${token.states.hover.background};
      }
    `
  }

  if (props['aria-sort'] && props['aria-sort'] !== 'none') {
    const active = R.mergeDeepRight(token, token.states.active)
    sortStylingActive = css`
      ${bordersTemplate(active.border)}
      background: ${active.background};
      color: ${active.typography.color};
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

type CellProps = {
  sortDirection?: React.AriaAttributes['aria-sort']
} & ThHTMLAttributes<HTMLTableHeaderCellElement>

export const TableHeaderCell = ({
  children,
  sortDirection,
  ...rest
}: CellProps): JSX.Element => {
  const { density } = useTable()
  const token = applyDensity(density, tablehead)

  return (
    <StyledTableCell token={token} aria-sort={sortDirection} {...rest}>
      {children}
    </StyledTableCell>
  )
}

// Cell.displayName = 'eds-table-cell'
