import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import tableTokens from '@equinor/eds-tokens/components/table/table.json'
import { typographyTemplate } from './../_common/templates'

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
  const { background, height, text, spacings, borders, hover } = tokens
  const { typography } = text
  let base = `
  background: ${background};
  min-height: ${height};
  height: ${height};
  margin: 0;

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

const TableCell = (props) => {
  const { children, as, variant } = props
  const tokens = getTokens(as, variant)
  return (
    <TableBase as={as} tokens={tokens} {...props}>
      {children}
    </TableBase>
  )
}

TableCell.propTypes = {
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

TableCell.defaultProps = {
  className: '',
  // scope: '',
  as: 'td',
  variant: 'text',
}

TableCell.displayName = 'eds-table-cell'

export default TableCell
