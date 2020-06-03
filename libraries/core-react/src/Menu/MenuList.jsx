import React, { useEffect, useMe } from 'react'
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
  { children, focus, ...rest },
  ref,
) {
  const { focusedIndex, setFocusedIndex, setSubMenu, subMenu } = useMenu()

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
    if (focus === 'first') {
      setFocusedIndex(firstFocusIndex)
    }
    if (focus === 'last') {
      setFocusedIndex(lastFocusIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  const handleMenuItemChange = (direction, fallbackIndex) => {
    const i = direction === 'down' ? 1 : -1
    const currentFocus = focusableIndexs.indexOf(focusedIndex)
    const nextMenuItem = focusableIndexs[currentFocus + i]
    const nextFocus = nextMenuItem === undefined ? fallbackIndex : nextMenuItem
    setFocusedIndex(nextFocus)
  }

  const handleKeyPress = (event) => {
    const { key, target } = event

    if (key === 'Enter' || key === ' ') {
      // https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/js/PopupMenuItemLinks.js
      // simulate click event
      // Create simulated mouse event to mimic the behavior of ATs
      // and let the event handler handleClick do the housekeeping.
      // try {
      //   clickEvent = new MouseEvent('click', {
      //     'view': window,
      //     'bubbles': true,
      //     'cancelable': true
      //   });
      // }
      // catch (err) {
      //   if (document.createEvent) {
      //     // DOM Level 3 for IE 9+
      //     clickEvent = document.createEvent('MouseEvents');
      //     clickEvent.initEvent('click', true, true);
      //   }
      // }
      // tgt.dispatchEvent(clickEvent);
    }

    if (key === 'ArrowDown') {
      handleMenuItemChange('down', firstFocusIndex)
    }
    if (key === 'ArrowUp') {
      handleMenuItemChange('up', lastFocusIndex)
    }
    if (key === 'ArrowRight') {
      const {
        dataset: { index },
      } = target
      setSubMenu(target, parseInt(index, 0), 'first')
    }
    if (key === 'ArrowLeft') {
      // setSubMenu(target, subMenu.previous)
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
  focus: PropTypes.oneOf(['first', 'last', 'next', 'previouss']),
}

MenuList.defaultProps = {
  className: '',
  focus: undefined,
}

MenuList.displayName = 'eds-menu-list'
