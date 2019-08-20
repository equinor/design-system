import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.td``

const TableCell = (props) => {
  return <TableBase {...props}>{children}</TableBase>
}

TableCell.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

TableCell.defaultProps = {
  className: '',
}

TableCell.displayName = 'eds-table-cell'

export default TableCell
