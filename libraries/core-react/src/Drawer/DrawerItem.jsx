import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { itemHoverBackground, itemTypography, itemBorder, itemSpacings } = tokens

const StyledDrawerItem = styled.li.attrs(({ level }) => ({
  level,
}))`
  margin: 0;
  padding: 0;
  margin-left: 56px;
  list-style: none;

  a {
    font-size: ${itemTypography.fontSize};
    line-height: ${itemTypography.lineHeight};
    color: ${itemTypography.color};
    text-decoration: none;
    display: inline-block;
    width: 100%;
    padding-left: calc(${itemSpacings.top} - ${itemBorder.left.width});
    padding-top: ${itemSpacings.top};
    padding-bottom: ${itemSpacings.bottom};
    border-left: ${itemBorder.left.width} solid ${itemBorder.left.color};

    &:hover {
      background: ${itemHoverBackground};
    }

    ${({ active }) =>
      active &&
      css`
        font-weight: bold;
      `}
  }
`

export const DrawerItem = forwardRef(function EdsDrawerItem(
  { children, active, ...rest },
  ref,
) {
  return (
    <StyledDrawerItem {...rest} active={active} ref={ref}>
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
  /** Active */
  active: PropTypes.bool,
}

DrawerItem.defaultProps = {
  className: '',
  children: undefined,
  active: false,
}
