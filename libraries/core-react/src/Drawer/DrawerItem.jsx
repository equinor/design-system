import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography, Icon } from '..'
import { drawer as tokens } from './Drawer.tokens'

const { background, itemBorder } = tokens

const StyledDrawerItem = styled.li`
  margin-left: 56px;
  padding-left: 14px;
  font-size: 12px;
  line-height: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  list-style: none;
  border-left: ${itemBorder.left.width} solid ${itemBorder.left.color}; */
`

export const DrawerItem = forwardRef(function EdsDrawerItem(
  { children, href, ...rest },
  ref,
) {
  return (
    <StyledDrawerItem {...rest} href={href} ref={ref}>
      <Typography variant="body_short" link href={href}>
        {children}
      </Typography>
    </StyledDrawerItem>
  )
})

DrawerItem.displayName = 'eds-drawer-item'

DrawerItem.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  href: PropTypes.string,
  /** Icon */
  icon: PropTypes.string,
}

DrawerItem.defaultProps = {
  className: '',
  children: undefined,
  href: '',
  icon: undefined,
}
