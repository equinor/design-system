import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledActions = styled.div`
  grid-area: right;
  text-align: right;
`

export const Actions = forwardRef(function EdsTopBarActions(
  { children, ...props },
  ref,
) {
  return (
    <StyledActions ref={ref} {...props}>
      {children}
    </StyledActions>
  )
})

Actions.displayName = 'eds-topbar-actions'

Actions.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Actions.defaultProps = {
  className: null,
  children: null,
}
