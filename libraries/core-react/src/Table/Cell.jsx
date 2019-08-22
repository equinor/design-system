import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import tableTokens from '@equinor/eds-tokens/components/table/table.json'

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

const getBorderTemplate = (borders) =>
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

  color: ${text.color};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  line-height: ${typography.lineHeight};

  padding-left: ${spacings.spacing_left};
  padding-right: ${spacings.spacing_right};

  &:hover {
    background: ${hover.background}
  }
  ${getBorderTemplate(borders)}

  `

  if (typography.fontStyle) {
    base = base + `font-style: ${typography.fontStyle};`
  }
  if (typography.letterSpacing) {
    base = base + `letter-spacing: ${typography.letterSpacing};`
  }
  if (typography.textTransform) {
    base = base + `text-transform: ${typography.textTransform};`
  }
  if (typography.textDecoration) {
    base = base + `text-decoration: ${typography.textDecoration};`
  }
  if (typography.fontFeature) {
    base = base + ` font-feature-settings: ${typography.fontFeature};`
  }

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
