import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

const ListItem = forwardRef(function ListItem({ children, ...props }, ref) {
  return (
    <li {...props} ref={ref}>
      {children}
    </li>
  )
})

ListItem.displayName = 'eds-listitem'

ListItem.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

ListItem.defaultProps = {
  className: undefined,
}

export { ListItem }
