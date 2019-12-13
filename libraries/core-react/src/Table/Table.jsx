import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
`

export const Table = (props) => {
  const { children } = props
  return <TableBase {...props}>{children}</TableBase>
}

Table.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Table.defaultProps = {
  className: '',
}

Table.displayName = 'eds-table'
