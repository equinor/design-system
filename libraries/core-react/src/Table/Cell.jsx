import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import tableTokens from '@equinor/eds-tokens/components/table/table.json'
import { typographyTemplate } from '../_common/templates'

const { header, cell } = tableTokens

const variants = {
  header: {
    text: header.text,
  },
  cell: {
    text: cell.text,
    numeric: cell.monospaced_numeric,
    icon: cell.icon,
    input: cell.input,
  },
}

const getTokens = (as, variant) => {
  switch (as) {
    case 'th':
      return variants.header[variant]
    case 'td':
    default:
      return variants.cell[variant]
  }
}

const borderTemplate = (borders) =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width } = borders[val]
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')

const Base = ({ tokens }) => {
  const { background, height, text, spacings, borders } = tokens
  const { typography } = text
  const base = `
  background: ${background};
  min-height: ${height};
  height: ${height};

  padding-left: ${spacings.left};
  padding-right: ${spacings.right};

  ${borderTemplate(borders)}
  ${typographyTemplate(typography)}
  `
  return base
}

const TableBase = styled.td`
  ${Base}
`

/**
 * @typedef Props
 * @prop {React.ReactNode} children
 * @prop {'td' | 'th'} [as] Specifies which td or th to use
 * @prop {'text' | 'icon' | 'numeric' | 'input'} [variant] Specifies which variant to use
 */

/**
 * @param {Props} props
 */
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
