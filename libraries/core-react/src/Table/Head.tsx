import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { getTokens } from './Table.tokens'
import type { Border } from '@equinor/eds-tokens'

const borderTemplate = (borders: Border): string =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width }: Border = borders[val]
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')

type StyledTableHeadProps = {
  token: {
    borders: Border
    background: string
  }
}

const StyledTableHead = styled.thead<StyledTableHeadProps>`
  ${({ token: { borders, background } }) => css`
      ${borderTemplate(borders)}
      background: ${background};`}
`

export const Head = ({ children, ...props }) => {
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
