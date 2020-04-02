import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledContainer = styled.div`
  /* position: fixed;
  z-index: 1; */
  background: #ffffff;
  width: 254px;
  border-right: 2px solid #f7f7f7;
`

export const Container = forwardRef(function EdsDrawerContainer(
  { children, ...props },
  ref,
) {
  return (
    <StyledContainer {...props} ref={ref}>
      {children}
    </StyledContainer>
  )
})

Container.displayName = 'eds-drawer-container'

Container.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Container.defaultProps = {
  className: '',
  children: undefined,
}
