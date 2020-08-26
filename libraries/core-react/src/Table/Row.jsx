// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.tr``

export const Row = (props) => {
  const { children } = props

  return <TableBase {...props}>{children}</TableBase>
}

Row.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Row.defaultProps = {
  className: '',
}

Row.displayName = 'eds-table-row'
