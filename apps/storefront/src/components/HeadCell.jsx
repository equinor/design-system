import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '@equinor/eds-core-react/dist/core-react.cjs.js'

const { Cell } = Table

const HeadCell = ({ children }) => {
  /*  Antar at de fleste tabeller er scope=col */
  return (
    <Cell as="th" scope="col" style={{ textAlign: 'left' }}>
      {children}
    </Cell>
  )
}
HeadCell.propTypes = {
  children: PropTypes.node.isRequired,
}

// eslint-disable-next-line
export default HeadCell
