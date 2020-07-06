import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.thead`
  text-align: left;
`

export const Head = (props) => {
  const { children } = props

  return <TableBase {...props}>{children}</TableBase>
}

Head.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Head.defaultProps = {
  className: '',
}

Head.displayName = 'eds-table-head'
