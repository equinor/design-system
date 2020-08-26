// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { getTokens } from './Table.tokens'
import { typographyTemplate } from '../_common/templates'

const borderTemplate = (borders) =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width } = borders[val]
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')

const Base = ({ tokens, as }) => {
  const { background, height, text, spacings, borders } = tokens
  const { typography } = text
  const bordersAndBackground =
    as !== 'th'
      ? css`
          ${borderTemplate(borders)}
          background: ${background};
        `
      : ''

  const base = css`
    min-height: ${height};
    height: ${height};

    padding-left: ${spacings.left};
    padding-right: ${spacings.right};

    ${bordersAndBackground}
    ${typographyTemplate(typography)}
  `
  return base
}

const TableBase = styled.td`
  ${Base}
`

export const Cell = (props) => {
  const { children, as, variant } = props
  const tokens = getTokens(as, variant)
  return (
    <TableBase as={as} tokens={tokens} {...props}>
      {children}
    </TableBase>
  )
}

Cell.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** Specifies which td or th to use */
  as: PropTypes.oneOf(['td', 'th']),
  /** Specifies the scope of th */
  // scope: PropTypes.oneOf(['col', 'row']),
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(['text', 'icon', 'numeric', 'input']),
}

Cell.defaultProps = {
  className: '',
  // scope: '',
  as: 'td',
  variant: 'text',
}

Cell.displayName = 'eds-table-cell'
