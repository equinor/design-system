import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import tableTokens from '@equinor/eds-tokens/components/table/table.json'

const { header, cell } = tableTokens

const getTokens = (as) => {
  switch (as) {
    case 'th':
      return header.text
    case 'td':
    default:
      return cell.text
  }
}

const getBorderTemplate = (borders) =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width } = borders[val]
    return `${acc} border-${val}: ${width} solid ${color}`
  }, '')

const Base = ({ tokens }) => {
  const { background, height, text, spacings, borders } = tokens
  const { typography } = text
  return `
  background: ${background};
  min-height: ${height};

  color: ${text.color};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  line-height: ${typography.lineHeight};

  padding-left: ${spacings.spacing_left};
  padding-right: ${spacings.spacing_right};

  ${getBorderTemplate(borders)}
  `
}

const TableBase = styled.td`
  ${Base}
`

const TableCell = (props) => {
  const { children, as } = props
  const tokens = getTokens(as)
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
