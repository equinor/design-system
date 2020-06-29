import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useMenu } from './Menu.context'
import { useCombinedRefs } from '../_common'

const List = styled.ul.attrs({ role: 'menu' })`
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;

  li:first-child {
    z-index: 3;
  }
`

export const MenuList = React.forwardRef(function EdsMenuList(
  { children, focus, ...rest },
  ref,
) {
  const listRef = useRef(null)
  const state = useMenu()
  const { focusedIndex, setFocusedIndex, setTransform } = state

  const updatedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      index,
    }),
  )

  const focusableIndexs = updatedChildren
    .filter((x) => !x.props.disabled)
    .filter((x) => x.type.displayName === 'eds-menu-item')
    .map((x) => x.props.index)

  const firstFocusIndex = focusableIndexs[0]
  const lastFocusIndex = focusableIndexs[focusableIndexs.length - 1]

  useEffect(() => {
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect()
      setTransform(rect, window)
    }
    if (focus === 'first') {
      setFocusedIndex(firstFocusIndex)
    }
    if (focus === 'last') {
      setFocusedIndex(lastFocusIndex)
    }
  }, [focus, listRef.current])

  const handleMenuItemChange = (direction, fallbackIndex) => {
    const i = direction === 'down' ? 1 : -1
    const currentFocus = focusableIndexs.indexOf(focusedIndex)
    const nextMenuItem = focusableIndexs[currentFocus + i]
    const nextFocusedIndex =
      nextMenuItem === undefined ? fallbackIndex : nextMenuItem
    setFocusedIndex(nextFocusedIndex)
  }

  const handleKeyPress = (event) => {
    const { key } = event

    if (key === 'ArrowDown') {
      handleMenuItemChange('down', firstFocusIndex)
    }
    if (key === 'ArrowUp') {
      handleMenuItemChange('up', lastFocusIndex)
    }
  }

  return (
    <List
      onKeyDown={handleKeyPress}
      {...rest}
      ref={useCombinedRefs(ref, listRef)}
    >
      {updatedChildren}
    </List>
  )
})

MenuList.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  /** Focus menuItem */
  focus: PropTypes.oneOf(['first', 'last']),
}

MenuList.defaultProps = {
  className: '',
  focus: undefined,
}

MenuList.displayName = 'eds-menu-list'
