import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCustomContent = styled.div`
  grid-area: center;
  min-height: 16px;
`

export const CustomContent = forwardRef(function EdsDialogCustomContent(
  { children, ...props },
  ref,
) {
  return (
    <StyledCustomContent id="eds-dialog-customcontent" ref={ref} {...props}>
      {children}
    </StyledCustomContent>
  )
})

CustomContent.displayName = 'eds-dialog-customcontent'

CustomContent.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CustomContent.defaultProps = {
  className: undefined,
  children: undefined,
}
