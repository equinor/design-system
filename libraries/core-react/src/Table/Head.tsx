import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { getTokens, TableCell } from './Table.tokens'
import type { Border } from '@equinor/eds-tokens'

const borderTemplate = (borders: { bottom: Border }): string =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width }: Border = borders[val] as Border
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')

type StyledTableHeadProps = {
  token: TableCell
}

const StyledTableHead = styled.thead<StyledTableHeadProps>`
  ${({ token: { borders, background } }) => css`
      ${borderTemplate(borders)}
      background: ${background};`}
`

export const Head: FunctionComponent = ({ children, ...props }) => {
  const token = getTokens('th', 'text')
  return (
    <StyledTableHead token={token} {...props}>
      {children}
    </StyledTableHead>
  )
}

Head.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Head.defaultProps = {
  className: '',
}

Head.displayName = 'eds-table-head'
