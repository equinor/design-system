import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const PopoverContent = forwardRef(function EdsPopoverContent(
  { children, className, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return <div {...props}>{children}</div>
})

PopoverContent.displayName = 'eds-popover-content'

PopoverContent.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

PopoverContent.defaultProps = {
  className: '',
  children: undefined,
}
