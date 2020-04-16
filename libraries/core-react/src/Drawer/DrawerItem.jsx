import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const {
  itemHoverBackground,
  itemTypography,
  itemActive,
  itemBorder,
  itemSpacings,
} = tokens

const StyledDrawerItem = styled.li.attrs(({ level }) => ({
  level,
}))`
  margin: 0;
  padding: 0;
  margin-left: 16px;
  list-style: none;
  border-left: ${itemBorder.left.width} solid ${itemBorder.left.color};

/*
  &:hover {
    background: ${itemHoverBackground};
  } */

  svg {
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }

  p {
    font-size: ${itemTypography.fontSize};
    line-height: ${itemTypography.lineHeight};
    color: ${itemTypography.color};
    text-decoration: none;
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 32px);
    padding-left: calc(${itemSpacings.top} - ${itemBorder.left.width});
    padding-top: ${itemSpacings.top};
    padding-bottom: ${itemSpacings.bottom};

    ${({ active }) =>
      active &&
      css`
        font-weight: bold;
        color: ${itemActive.color};
      `}
  }

  a {
    font-size: ${itemTypography.fontSize};
    line-height: ${itemTypography.lineHeight};
    color: ${itemTypography.color};
    text-decoration: none;
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 32px);
    padding-left: calc(${itemSpacings.top} - ${itemBorder.left.width});
    padding-top: ${itemSpacings.top};
    padding-bottom: ${itemSpacings.bottom};

    ${({ active }) =>
      active &&
      css`
        font-weight: bold;
        color: ${itemActive.color};
        position: relative;

        &::before {
          position: absolute;
          top: 16px;
          left: -2px;
          width: 2px;
          min-height: 16px;
          content: '';
          border-left: ${itemBorder.left.width} solid ${itemActive.color};
        }
      `}
  }
`

export const DrawerItem = forwardRef(function EdsDrawerItem(
  { children, active, ...rest },
  ref,
) {
  console.log(children)
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
