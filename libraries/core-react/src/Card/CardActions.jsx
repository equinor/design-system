import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCardActions = styled.div`
  grid-area: bottom;
  text-align: bottom;
`

export const CardActions = forwardRef(function EdsCardActions(
  { children, ...props },
  ref,
) {
  return (
    <StyledCardActions ref={ref} {...props}>
      {children}
    </StyledCardActions>
  )
})

CardActions.displayName = 'eds-card-actions'

CardActions.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardActions.defaultProps = {
  className: '',
  children: undefined,
}
