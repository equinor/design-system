import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useMenu } from './Menu.context'

const isFragment = (object) =>
  (object.type && object.type.toString()) === React.Fragment.toString()

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
  const { focusedIndex, setFocusedIndex } = useMenu()

  const children_ = isFragment(children) ? children.props.children : children

  const updatedChildren = React.Children.map(children_, (child, index) =>
    React.cloneElement(child, { index }),
  )

  const focusableIndexs = (updatedChildren || [])
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
    event.stopPropagation()

    if (key === 'ArrowDown') {
      handleMenuItemChange('down', firstFocusIndex)
    }
    if (key === 'ArrowUp') {
      handleMenuItemChange('up', lastFocusIndex)
    }
  }

  return (
    <List onKeyDown={handleKeyPress} {...rest} ref={ref}>
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
