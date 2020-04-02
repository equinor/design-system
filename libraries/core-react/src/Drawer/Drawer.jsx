import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledDrawer = styled.div`
  background: none;
`

export const Drawer = forwardRef(function EdsDrawer(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawer {...props} ref={ref}>
      {children}
    </StyledDrawer>
  )
})

Drawer.displayName = 'eds-drawer'

Drawer.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Overlay content */
  overlay: PropTypes.bool,
}

Drawer.defaultProps = {
  className: '',
  children: undefined,
  overlay: false,
}
