import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useMenu } from './Menu.context'

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
  { children, ...rest },
  ref,
) {
  const { focusedIndex, setFocusedIndex } = useMenu()

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

  const handleMenuItemChange = (direction, fallbackIndex) => {
    const i = direction === 'down' ? 1 : -1
    const currentFocus = focusableIndexs.indexOf(focusedIndex)
    const nextMenuItem = focusableIndexs[currentFocus + i]
    const nextFocus = nextMenuItem === undefined ? fallbackIndex : nextMenuItem
    setFocusedIndex(nextFocus)
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
}

MenuList.defaultProps = {
  className: '',
}

MenuList.displayName = 'eds-menu-list'
