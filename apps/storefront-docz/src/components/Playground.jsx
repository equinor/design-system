import React from 'react'
import PropTypes from 'prop-types'
import { Playground as DoczPlayground } from 'docz'

const Playground = ({ ...props }) => {
  // Styles applied to the Playground element doesn't work
  // https://github.com/doczjs/docz/issues/412#issuecomment-656203258
  return process.env.GATSBY_STAGE === 'dev' ? (
    <div>
      <DoczPlayground {...props} />
    </div>
  ) : (
    <div>Playground coming soon…</div>
  )
}

Playground.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Playground // eslint-disable-line
