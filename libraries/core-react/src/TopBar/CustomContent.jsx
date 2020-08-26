// @ts-nocheck
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCustomContent = styled.div`
  grid-area: center;
`

export const CustomContent = forwardRef(function EdsTopBarCustomContent(
  { children, ...props },
  ref,
) {
  return (
    <StyledCustomContent ref={ref} {...props}>
      {children}
    </StyledCustomContent>
  )
})

CustomContent.displayName = 'eds-topbar-customcontent'

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
