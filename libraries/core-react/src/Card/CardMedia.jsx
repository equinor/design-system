import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCardMedia = styled.div`
  grid-area: center;
`

export const CardMedia = forwardRef(function EdsTopBarCardMedia(
  { children, ...props },
  ref,
) {
  return (
    <StyledCardMedia ref={ref} {...props}>
      {children}
    </StyledCardMedia>
  )
})

CardMedia.displayName = 'eds-card-media'

CardMedia.propTypes = {
  // Src
  src: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardMedia.defaultProps = {
  src: '',
  className: '',
  children: undefined,
}
