import React from 'react'
import PropTypes from 'prop-types'
import { Playground as DoczPlayground } from 'docz'

const Playground = ({ children }) => {
  // Styles applied to the Playground element doesn't work
  // https://github.com/doczjs/docz/issues/412#issuecomment-656203258
  return (
    <DoczPlayground style={{ background: 'rebeccapurple' }}>
      {children}
    </DoczPlayground>
  )
}

Playground.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Playground // eslint-disable-line
