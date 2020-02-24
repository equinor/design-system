import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const Panel = forwardRef(function Panel(
  { index, value, children, ...props },
  ref,
) {
  return (
    <div
      hidden={value !== index}
      role="tabpanel"
      tabIndex="0"
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
})

Panel.propTypes = {
  /** The index of the active tab */
  value: PropTypes.number,
  /** The index of the panel */
  index: PropTypes.number,
  /** If `true`, the panel will be hidden. */
  hidden: PropTypes.oneOf([PropTypes.bool, undefined]),
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Panel.defaultProps = {
  value: 0,
  index: 0,
  className: null,
  hidden: undefined,
}
