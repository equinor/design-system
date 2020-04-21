import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { chevron_right } from '@equinor/eds-icons'
import { Icon } from '..'
import { drawer as tokens } from './Drawer.tokens'

const icons = {
  chevron_right,
}

Icon.add(icons)

const {
  itemHoverBackground,
  itemTypography,
  itemActive,
  itemBorder,
  itemSpacings,
} = tokens

const StyledDrawerItem = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
  width: auto;
  position: relative;
  border-left: ${itemBorder.left.width} solid ${itemBorder.left.color};

  &:hover {
    background: ${itemHoverBackground};
  }

  svg {
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }

  svg.child_icon {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 16px;
    height: 16px;
  }

  ul {
    width: auto;
  }

  p {
    font-size: ${itemTypography.fontSize};
    line-height: ${itemTypography.lineHeight};
    color: ${itemTypography.color};
    text-decoration: none;
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 48px);
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
  // const [state, setState] = useState({
  //   hasLink: false,
  //   hasChildren: false,
  // })
  // console.log(children, rest)

  return (
    <StyledDrawerItem {...rest} active={active} ref={ref}>
      {children.length > 1 && (
        <Icon className="child_icon" name="chevron_right" size={16} />
      )}
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
