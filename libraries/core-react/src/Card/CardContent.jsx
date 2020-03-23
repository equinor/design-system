import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCardContent = styled.div`
  grid-area: center;
`

export const CardContent = forwardRef(function EdsCardContent(
  { children, ...props },
  ref,
) {
  return (
    <StyledCardContent ref={ref} {...props}>
      {children}
    </StyledCardContent>
  )
})

CardContent.displayName = 'eds-card-content'

CardContent.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardContent.defaultProps = {
  className: '',
  children: undefined,
}
