import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Cell from './Cell'

const TableBase = styled.thead``

const TableHead = (props) => {
  const { children } = props

  return <TableBase {...props}>{children}</TableBase>
}

TableHead.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

TableHead.defaultProps = {
  className: '',
}

TableHead.displayName = 'eds-table-head'

export default TableHead
