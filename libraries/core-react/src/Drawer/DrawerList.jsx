import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

const StyledDrawerList = styled.div`
  background: ${background.backgroundColor};
  width: 254px;
  border-right: ${border.right.width} solid ${border.right.color};
`

export const DrawerList = forwardRef(function EdsDrawerList(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawerList {...props} ref={ref}>
      {children}
    </StyledDrawerList>
  )
})

DrawerList.displayName = 'eds-drawer-list'

DrawerList.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

DrawerList.defaultProps = {
  className: '',
  children: undefined,
}
