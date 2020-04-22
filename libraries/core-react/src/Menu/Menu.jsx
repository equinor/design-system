import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { useCombinedRefs } from '../_common'

const {
  enabled: { elevation, background },
} = tokens

const pos = ({ left, top }) => css`
  left: ${left}px;
  top: ${top}px;
`

const Paper = styled.div`
  min-width: 96px;
  max-width: calc(100% -32px);
  background: ${background};
  box-shadow: ${elevation};
  position: absolute;
  z-index: 1;
  ${pos}
`

const StyledMenu = styled.ul.attrs({ role: 'menu' })`
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;

  li:first-child {
    z-index: 3;
  }
`

export const Menu = React.forwardRef(function EdsMenu(
  { anchorEl, children, ...rest },
  ref,
) {
  const [focusedMenuItem, setfocusedMenuItem] = React.useState(0)

  if (!anchorEl) {
    return undefined
  }

  const rect = anchorEl.getBoundingClientRect()

  // anchorEl.onclick(() => console.log('clicked'))

  // const focusRef = (node) => {
  //   debugger
  //   if (node !== null) {
  //     node.focus()
  //   }
  // }

  // useEffect(() => {}, [focusedMenuItem])

  const children_ = React.Children.map(children, (child, index) => {
    // const menuItemRef =
    //   index === focusedMenuItem
    //     ? useCombinedRefs(child.ref, focusRef)
    //     : child.ref

    return React.cloneElement(child, {
      _index: index,
      // ref: menuItemRef,
    })
  })

  const focusableChildren = children_
    .filter((x) => !x.props.disabled)
    .map((x) => x.props._index)

  const firstFocusableChild = focusableChildren[0]
  const lastFocusableChild = focusableChildren[focusableChildren.length - 1]

  const handleMenuItemChange = (direction, fallbackItem) => {
    const i = direction === 'down' ? 1 : -1
    const currentMenuItemIndex = focusableChildren.indexOf(focusedMenuItem)
    const nextMenuItem = focusableChildren[currentMenuItemIndex + i]
    const nextFocus = nextMenuItem === undefined ? fallbackItem : nextMenuItem
    console.log('menuItem', nextFocus)
    setfocusedMenuItem(nextFocus)
  }

  const handleKeyPress = (event) => {
    const { key } = event
    console.log('keyEvent', key)

    if (key === 'ArrowDown') {
      handleMenuItemChange('down', firstFocusableChild)
    }
    if (key === 'ArrowUp') {
      handleMenuItemChange('up', lastFocusableChild)
    }
  }

  const props = {
    ...rest,
    top: rect && rect.y,
    left: rect.y,
  }

  return (
    <Paper>
      <StyledMenu onKeyDown={handleKeyPress} {...props} ref={ref}>
        {children}
      </StyledMenu>
    </Paper>
  )
})

Menu.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Element the menu is anchored to */
  anchorEl: PropTypes.node,
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
}

Menu.displayName = 'eds-menu'
