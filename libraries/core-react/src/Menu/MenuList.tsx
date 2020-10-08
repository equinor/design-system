import React, { useEffect, ReactElement, ReactNode } from 'react'
import styled from 'styled-components'
import { useMenu } from './Menu.context'
import type { FocusTarget } from './types'
import type { MenuItemProps } from './MenuItem'
import type { MenuSectionProps } from './MenuSection'

const isFragment = (object: ReactNode): boolean => {
  if ((object as ReactElement).type) {
    return (object as ReactElement).type === React.Fragment
  }
  return object === React.Fragment
}

const List = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;

  li:first-child {
    z-index: 3;
  }
`
type Props = {
  focus: FocusTarget
} & React.HTMLAttributes<HTMLUListElement>

type MenuChild = ReactElement<MenuItemProps> &
  ReactElement<MenuSectionProps> & {
    type: { displayName?: string }
  }

type Direction = 'down' | 'up'

export const MenuList = React.forwardRef<HTMLUListElement, Props>(
  function EdsMenuList({ children, focus, ...rest }, ref) {
    const { focusedIndex, setFocusedIndex } = useMenu()

    const pickedChildren = isFragment(children)
      ? (children as MenuChild).props.children
      : children

    const updatedChildren: Array<MenuChild> = React.Children.map(
      pickedChildren,
      (child: ReactNode, index: number) =>
        React.cloneElement(child as MenuChild, { index }),
    )

    const focusableIndexs: number[] = (updatedChildren || [])
      .filter((x) => !x.props.disabled)
      .filter((x) => x.type ?? x.type.displayName.includes('eds-menu'))
      .map((x) => x.props.index)

    const firstFocusIndex = focusableIndexs[0]
    const lastFocusIndex = focusableIndexs[focusableIndexs.length - 1]

    useEffect(() => {
      if (focus === 'first') {
        setFocusedIndex(firstFocusIndex)
      }
      if (focus === 'last') {
        setFocusedIndex(lastFocusIndex)
      }
    }, [focus])

    const handleMenuItemChange = (
      direction: Direction,
      fallbackIndex: number,
    ) => {
      const i = direction === 'down' ? 1 : -1
      const currentFocus: number = focusableIndexs.indexOf(focusedIndex)
      const nextMenuItem: number = focusableIndexs[currentFocus + i]
      const nextFocusedIndex: number =
        typeof nextMenuItem === 'undefined' ? fallbackIndex : nextMenuItem

      setFocusedIndex(nextFocusedIndex)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLUListElement>) => {
      const { key } = event
      event.stopPropagation()

      if (key === 'ArrowDown') {
        handleMenuItemChange('down', firstFocusIndex)
      }
      if (key === 'ArrowUp') {
        handleMenuItemChange('up', lastFocusIndex)
      }
    }

    return (
      <List onKeyDown={handleKeyPress} role="menu" {...rest} ref={ref}>
        {updatedChildren}
      </List>
    )
  },
)

MenuList.displayName = 'eds-menu-list'
