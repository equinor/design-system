// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.tbody``

export const Body = (props) => {
  const { children } = props

  return <TableBase {...props}>{children}</TableBase>
}

Body.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Body.defaultProps = {
  className: '',
}

Body.displayName = 'eds-table-body'
