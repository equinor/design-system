import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  overflow: hidden;
`

export const PopoverContent = forwardRef(function EdsPopoverContent(
  { children, className, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return <ContentWrapper {...props}>{children}</ContentWrapper>
})

PopoverContent.displayName = 'eds-popover-content'

PopoverContent.propTypes = {
  /** Children in popover content is required */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

PopoverContent.defaultProps = {
  className: '',
}
