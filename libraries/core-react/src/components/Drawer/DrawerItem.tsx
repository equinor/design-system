import React, {
  forwardRef,
  HTMLAttributes,
  useState,
  isValidElement,
  ReactElement,
  MouseEvent,
  KeyboardEvent,
  useRef,
} from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { useCombinedRefs, useKeyboardNavigation } from '@hooks'
import { useDrawer } from './Drawer.context'
import { drawer as tokens } from './Drawer.tokens'
import { DrawerList } from './DrawerList'
import { List } from '../List'
import { Typography } from '../Typography'
import { Item } from '@react-stately/collections'
import { useMenu, useMenuItem, useMenuSection } from '@react-aria/menu'
import { useFocus } from '@react-aria/interactions'

const icons = {
  chevron_down,
  chevron_up,
}

Icon.add(icons)

const { ListItem } = List

const {
  itemHoverBackground,
  itemTypography,
  itemActive,
  itemBorder,
  itemSpacings,
  outline,
  outlineOffset,
} = tokens

type StyledDrawerItemProps = { isNested: boolean } & Pick<
  DrawerItemProps,
  'active' | 'open' | 'index' | 'disabled'
> &
  HTMLAttributes<HTMLLIElement>

const StyledDrawerItem = styled(ListItem).attrs<StyledDrawerItemProps>(
  ({
    active,
    open,
    index,
    isNested,
    disabled,
  }): JSX.IntrinsicElements['button'] => ({
    'aria-current': index === active ? 'page' : undefined,
    'aria-haspopup': isNested,
    'aria-expanded': isNested && open,
    // tabIndex: 0,
    disabled,
  }),
)<StyledDrawerItemProps>`
  margin: 0;
  padding: 0;
  list-style: none;
  width: auto;
  position: relative;

  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;

          > * {
            cursor: pointer;
          }
        `}

  &[data-focus-visible-added]:focus {
    outline: ${outline};
    outline-offset: ${outlineOffset};
  }

  /* border-left: ${itemBorder.left.width} solid ${itemBorder.left.color}; */

  /* svg {
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }
  svg.chevron_icon {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 16px;
    height: 16px;
  } */
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
    /* width: calc(100% - 32px); */
    padding-top: ${itemSpacings.top};
    padding-bottom: ${itemSpacings.bottom};
    margin-left: 48px;
    padding-left: 14px;
    border-left: ${itemBorder.left.width} solid ${itemBorder.left.color};

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
  /** Active drawer item id*/
  active?: number
  /** @ignore index */
  index?: number
  /** Disabled drawer item */
  disabled?: boolean
  /** List is open */
  open?: boolean
  /** If item is expandable */
  expandable?: boolean
  /** onClick handler */
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  /** href for anchor tag */
  href?: string
  /** Level of DrawerList parent */
  level?: string
  /** Id of parent (DrawerList) */
  drawerListId?: string
  // children?: React.ReactElement
} & HTMLAttributes<HTMLLIElement>

type ChildType = {
  disabled?: boolean
} & React.ReactElement

export const DrawerItem = forwardRef<HTMLLIElement, DrawerItemProps>(
  function DrawerItem(
    {
      children,
      disabled,
      open = true,
      index,
      onClick,
      href,
      active,
      level,
      drawerListId = '',
      ...rest
    },
    ref,
  ) {
    const { focusedIndex, setFocusedIndex, onClose } = useDrawer()
    // console.log('draweritem: ', rest.drawerListId)
    // Add a level check and deeper context levels

    const [drawerOpen, setDrawerOpen] = useState(open)
    const refLi = React.useRef<HTMLAnchorElement>(null)

    // old logic before moving label up to DrawerList
    const handleClick = (event: MouseEvent<HTMLLIElement, MouseEvent>) => {
      if (!disabled) {
        //console.log('click', index, rest)
        setDrawerOpen(!drawerOpen)
        // setFocusedIndex(index)
        event.stopPropagation()
      }
    }

    const toggleFocus = (i: number, drawerListId: string) => {
      if (focusedIndex !== i) {
        setFocusedIndex(i, drawerListId)
      }
    }

    // TODO: Move this to List instead
    const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
      const { key } = event

      if (key === 'Enter' || (key === ' ' && !disabled)) {
        //console.log('click enter or space', index, rest)
        setDrawerOpen(!drawerOpen)
        event.preventDefault()
      }
    }

    const isFocused = index === focusedIndex

    let itemElements
    let updatedChildren

    // Experimenting with useMenuItem from react aria
    // let { menuItemProps } = useMenuItem(
    //   {
    //     key: index,
    //     isDisabled: disabled,
    //     // onAction
    //   },
    //   // state,
    //   refLi,
    // )

    let Child

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

    let isNested: boolean

    const itemChildren = React.Children.map(
      children,
      (child: ChildType, childIndex) => {
        if (typeof child === 'string') {
          isNested = false
          return (
            <Typography
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}-anchor-${childIndex}`}
              variant="body_short"
              role="menuitem"
              link
              href={href}
              tabIndex={0}
            >
              {child}
            </Typography>
          )
        } else {
          isNested = true
        }
      },
    )

    if (
      typeof children !== 'object' &&
      !Array.isArray(children) &&
      children !== null
    ) {
      Child = React.Children.map(children, (child, childIndex) => {
        // console.log(children)
        return (
          <Typography
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}-anchor-${childIndex}`}
            variant="body_short"
            role="menuitem"
            link
            href={href}
            ref={refLi}
            tabIndex={0}
          >
            {child}
          </Typography>
        )
      })
    }

    const props = {
      ...rest,
      disabled,
      isNested,
      index,
      open: drawerOpen,
    }

    return (
      <StyledDrawerItem
        {...props}
        key={`${index}-list-item`}
        // onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="none"
        ref={useCombinedRefs<HTMLLIElement>(
          ref,
          (el: HTMLLIElement) => isFocused && el.focus(),
        )}
        onFocus={() => toggleFocus(index, drawerListId)}
        // onClick={(e) => {
        //   if (!disabled && onClick) {
        //     onClick(e)
        //     if (onClose !== null) {
        //       onClose(e)
        //     }
        //   }
        // }}
        // onFocus={() => setFocusedIndex(index)}
      >
        {/* {isNested && level !== 'child' && chevronIcon} */}
        {isNested && itemElements}
        {isNested && drawerOpen && updatedChildren}
        {Child && Child}
      </StyledDrawerItem>
    )
  },
)

DrawerItem.displayName = 'DrawerItem'
