import React from 'react'
import PropTypes from 'prop-types'

export const Head = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
)

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
