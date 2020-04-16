import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

const StyledDrawerContainer = styled.nav`
  background: ${background.backgroundColor};
  width: 254px;
  height: 100%;
  border-right: ${border.right.width} solid ${border.right.color};
`

export const DrawerContainer = forwardRef(function EdsDrawerContainer(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawerContainer {...props} ref={ref}>
      {children}
    </StyledDrawerContainer>
  )
})

DrawerContainer.displayName = 'eds-drawer-container'

DrawerContainer.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

DrawerContainer.defaultProps = {
  className: '',
  children: undefined,
}
