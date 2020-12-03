import React, {
  forwardRef,
  HTMLAttributes,
  useState,
  isValidElement,
  ReactElement,
} from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { chevron_down } from '@equinor/eds-icons'
import { useCombinedRefs } from '@hooks'
import { useDrawer } from './Drawer.context'
import { drawer as tokens } from './Drawer.tokens'
import { DrawerList } from './DrawerList'
import { useMenu, useMenuItem, useMenuSection } from '@react-aria/menu'
import { useFocus } from '@react-aria/interactions'

const icons = {
  chevron_down,
}

Icon.add(icons)

const {
  itemHoverBackground,
  itemTypography,
  itemActive,
  itemBorder,
  itemSpacings,
} = tokens

type StyledDrawerItemProps = Pick<
  DrawerItemProps,
  'active' | 'open' | 'index'
> &
  HTMLAttributes<HTMLLIElement>

const StyledDrawerItem = styled.li<StyledDrawerItemProps>`
  margin: 0;
  padding: 0;
  list-style: none;
  width: auto;
  position: relative;
  /* border-left: ${itemBorder.left.width} solid ${itemBorder.left.color}; */
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
    padding-left: 56px;
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
    padding-left: 66px;
    padding-top: ${itemSpacings.top};
    padding-bottom: ${itemSpacings.bottom};
    /* border-left: ${itemBorder.left.width} solid ${itemBorder.left.color}; */

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

type DrawerItemProps = {
  /** Active drawer item */
  active?: boolean
  /** @ignore index */
  index?: number
  /** Disabled drawer item */
  disabled?: boolean
  /** List is open */
  open?: boolean
  // children?: React.ReactElement
} & HTMLAttributes<HTMLLIElement>

type ChildType = {
  disabled?: boolean
} & React.ReactElement

export const DrawerItem = React.memo(
  forwardRef<HTMLLIElement, DrawerItemProps>(function DrawerItem(
    { children, disabled, open, index, ...rest },
    ref,
  ) {
    // const { focusedIndex, setFocusedIndex } = useDrawer()
    // console.log('draweritem: ', rest.drawerListId)
    // Add a level check and deeper context levels

    const [drawerOpen, setDrawerOpen] = useState(open)

    const handleClick = (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    ) => {
      if (!disabled) {
        console.log('click', index, rest)
        setDrawerOpen(!drawerOpen)
        event.stopPropagation()
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
      const { key } = event
      if (key === 'Enter' || (key === ' ' && !disabled)) {
        console.log('click enter or space', index, rest)
        setDrawerOpen(!drawerOpen)
        event.preventDefault()
      }
    }

    const focusedIndex = -1
    const isFocused = index === focusedIndex // old isFocused

    let itemElements
    let updatedChildren: Array<ChildType>

    // Experimenting with useMenuItem from react aria
    // let refLi = React.useRef<HTMLLIElement>(null)
    // let { menuItemProps } = useMenuItem(
    //   {
    //     key: index,
    //     isDisabled: disabled,
    //     // onAction
    //   },
    //   // state,
    //   refLi,
    // )

    // const [isFocusedState, setFocused] = useState(false) // New isfocused
    // const { focusProps } = useFocus({ onFocusChange: setFocused })

    if (Array.isArray(children)) {
      updatedChildren = React.Children.map(children, (child: ChildType) => {
        // console.log('item child', child.type.displayName)
        if (isValidElement(child) && child.type === DrawerList) {
          return React.cloneElement(child, {
            disabled,
          })
        }
      })
      itemElements = React.Children.map(children, (child: ChildType) => {
        if (!isValidElement(child) || child.type !== DrawerList) {
          return React.cloneElement(child, {
            disabled,
          })
        }
      })
    } else {
      updatedChildren = [
        React.cloneElement(children as ChildType, {
          disabled,
        }),
      ]
    }

    // console.log('item children', updatedChildren, drawerOpen)

    const props = {
      ...rest,
      disabled,
    }
    console.log(updatedChildren)
    return (
      <StyledDrawerItem
        {...props}
        open={drawerOpen}
        index={index}
        ref={useCombinedRefs<HTMLLIElement>(
          ref,
          (el: HTMLLIElement) => isFocused && el.focus(),
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        // onFocus={() => setFocusedIndex(index)}
      >
        {updatedChildren.length > 1 && (
          <Icon className="child_icon" name="chevron_down" size={16} />
        )}
        {itemElements}
        {drawerOpen && updatedChildren}
      </StyledDrawerItem>
    )
  }),
)

DrawerItem.displayName = 'DrawerItem'
