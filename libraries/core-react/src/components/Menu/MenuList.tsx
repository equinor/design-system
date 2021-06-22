import {
  useEffect,
  ReactElement,
  ReactNode,
  isValidElement,
  Fragment,
  cloneElement,
  forwardRef,
  Children as ReactChildren,
} from 'react'
import styled from 'styled-components'
import { useMenu } from './Menu.context'
import type { FocusTarget } from './Menu.types'
import { MenuItemProps, MenuItem } from './MenuItem'
import { MenuSectionProps, MenuSection } from './MenuSection'
import { menu as tokens } from './Menu.tokens'
import { spacingsTemplate } from '../../utils'

const isFragment = (object: ReactNode): boolean => {
  if ((object as ReactElement).type) {
    return (object as ReactElement).type === Fragment
  }
  return object === Fragment
}

const List = styled.ul`
  position: relative;
  list-style: none;
  margin: 0;
  ${spacingsTemplate(tokens.spacings)}
  li:first-child {
    z-index: 3;
  }
`
type MenuListProps = {
  focus?: FocusTarget
  children: ReactNode
}

type MenuChild = ReactElement<MenuItemProps> & ReactElement<MenuSectionProps>

type Direction = 'down' | 'up'

export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(
  function MenuList({ children, focus, ...rest }, ref) {
    const { focusedIndex, setFocusedIndex } = useMenu()

    const pickedChildren = isFragment(children)
      ? (children as MenuChild).props.children
      : children

    const updatedChildren: Array<MenuChild> = ReactChildren.map(
      pickedChildren,
      (child: ReactNode, index: number) =>
        cloneElement(child as MenuChild, { index }),
    )

    const focusableIndexs: number[] = (updatedChildren || [])
      .filter((x) => !x.props.disabled)
      .filter(
        (x) =>
          isValidElement(x) && (x.type === MenuSection || x.type === MenuItem),
      )
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

// MenuList.displayName = 'EdsMenuList'
