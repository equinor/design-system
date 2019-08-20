import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.tr``

const TableRow = (props) => {
  return <TableBase {...props}>{children}</TableBase>
}

TableRow.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

TableRow.defaultProps = {
  className: '',
}

TableRow.displayName = 'eds-table-row'

export default TableRow
