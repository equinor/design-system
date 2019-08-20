import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.tbody``

const TableBody = (props) => {
  return <TableBase {...props}>{children}</TableBase>
}

TableBody.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

TableBody.defaultProps = {
  className: '',
}

TableBody.displayName = 'eds-table-body'

export default TableBody
