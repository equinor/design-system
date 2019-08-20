import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.table``

const Table = (props) => {
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

export default Table
