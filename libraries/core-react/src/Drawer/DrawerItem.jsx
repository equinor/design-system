import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, itemBorder } = tokens

const StyledDrawerItem = styled.div`
  margin-left: 56px;
  padding-left: 14px;
  border-left: ${itemBorder.left.width} solid ${itemBorder.left.color}; */
`

export const DrawerItem = forwardRef(function EdsDrawerItem(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawerItem {...props} ref={ref}>
      {children}
    </StyledDrawerItem>
  )
})

DrawerItem.displayName = 'eds-drawer-item'

DrawerItem.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

DrawerItem.defaultProps = {
  className: '',
  children: undefined,
}
