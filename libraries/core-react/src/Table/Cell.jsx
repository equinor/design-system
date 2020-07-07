import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import tableTokens from '@equinor/eds-tokens/components/table/table.json'
import { typographyTemplate } from '../_common/templates'

const {
  header: {
    text: {
      text: { typography: headerTypography, ...headerTextLevel2 },
      ...headerTextLevel1
    },
  },
  cell,
} = tableTokens

const variants = {
  header: {
    text: {
      ...headerTextLevel1,
      text: {
        ...headerTextLevel2,
        typography: {
          ...headerTypography,
          textAlign: 'left',
        },
      },
    },
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

const getTokensByProps = (variant, prop) => ({
  tableHead: variants.header[variant][prop],
  tableBody: variants.cell[variant][prop],
})

const borderTemplate = (borders) =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width } = borders[val]
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')

const Base = ({ tokens }) => {
  const { background, height, text, spacings, borders } = tokens
  const { typography } = text
  const base = `
  min-height: ${height};
  height: ${height};

  padding-left: ${spacings.left};
  padding-right: ${spacings.right};

  thead & {
    ${borderTemplate(borders.tableHead)}
    background: ${background.tableHead};
  }

  tbody & {
    ${borderTemplate(borders.tableBody)}
    background: ${background.tableBody};
  }

  ${typographyTemplate(typography)}
  `
  return base
}

const TableBase = styled.td`
  ${Base}
`

export const Cell = (props) => {
  const { children, as, variant } = props
  const tokens = {
    ...getTokens(as, variant),
    borders: getTokensByProps(variant, 'borders'),
    background: getTokensByProps(variant, 'background'),
  }
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
