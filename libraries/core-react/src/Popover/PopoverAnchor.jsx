// @ts-nocheck
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const PopoverAnchor = forwardRef(function PopoverAnchor(
  { className, children, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }
  return <div {...props}>{children}</div>
})

PopoverAnchor.displayName = 'eds-popover-anchor'

PopoverAnchor.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

PopoverAnchor.defaultProps = {
  children: undefined,
  className: '',
}
