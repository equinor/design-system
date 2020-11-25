import React, { forwardRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { chevron_right } from '@equinor/eds-icons'
import { useCombinedRefs } from '@hooks'
import { useDrawer } from './Drawer.context'
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
  label {
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
    max-width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
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
  { children, disabled, open, index, ...rest },
  ref,
) {
  // const { focusedIndex, setFocusedIndex } = useDrawer()
  // console.log('draweritem: ', rest.drawerListId)
  // Add a level check and deeper context levels

  const [drawerOpen, setDrawerOpen] = useState(open)

  const handleClick = (event) => {
    if (!disabled) {
      console.log('click', index, rest)
      setDrawerOpen(!drawerOpen)
      event.stopPropagation()
    }
  }

  const handleKeyDown = (event) => {
    const { key } = event
    if (key === 'Enter' || (key === ' ' && !disabled)) {
      console.log('click enter or space', index, rest)
      setDrawerOpen(!drawerOpen)
      event.preventDefault()
    }
  }

  const focusedIndex = -1
  const isFocused = index === focusedIndex

  let itemElements
  let updatedChildren

  if (Array.isArray(children)) {
    updatedChildren = React.Children.map(children, (child) => {
      console.log('item child', child.type.displayName)
      if (child.type.displayName === 'eds-drawer-list') {
        return React.cloneElement(child, {
          disabled,
        })
      }
    })
    itemElements = React.Children.map(children, (child) => {
      if (child.type.displayName !== 'eds-drawer-list') {
        return React.cloneElement(child, {
          disabled,
        })
      }
    })
  } else {
    updatedChildren = React.cloneElement(children, {
      disabled,
    })
  }

  // console.log('item children', updatedChildren, drawerOpen)

  const props = {
    ...rest,
    disabled,
  }

  return (
    <StyledDrawerItem
      {...props}
      open={drawerOpen}
      index={index}
      ref={useCombinedRefs(ref, (node) => isFocused && node.focus())}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // onFocus={() => setFocusedIndex(index)}
    >
      {updatedChildren.length > 1 && (
        <Icon className="child_icon" name="chevron_right" size={16} />
      )}
      {itemElements}
      {drawerOpen && updatedChildren}
    </StyledDrawerItem>
  )
})
