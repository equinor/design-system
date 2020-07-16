import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import { useCombinedRefs } from '../_common'
import { menu as tokens } from './Menu.tokens'

const {
  enabled: { border },
} = tokens

const StyledPaper = styled(Paper)`
  position: absolute;
  z-index: 1;
  width: fit-content;
  min-width: fit-content;
  border-radius: ${border.radius};

  ${({ left, top, transform, open, isPositioned }) =>
    css({
      left,
      top,
      transform,
      visibility: open && isPositioned ? 'visible' : 'hidden',
    })};
`

export const Menu = React.forwardRef(function EdsMenu(
  { children, anchorEl, onClose, open, ...rest },
  ref,
) {
  const listRef = useRef(null)

  const { setPosition, position, isPositioned } = useMenu()

  useEffect(() => {
    if (anchorEl && listRef.current) {
      const menuRect = listRef.current.getBoundingClientRect()
      const anchorRect = anchorEl.getBoundingClientRect()
      setPosition(anchorRect, menuRect, window)
    }

    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [anchorEl, listRef.current])

  const handleGlobalKeyPress = (e) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        onClose()
        break
      default:
        break
    }
  }

  const paperProps = {
    ...position,
    open,
    isPositioned,
  }

  return (
    <StyledPaper {...paperProps} elevation="raised">
      <MenuList {...rest} ref={useCombinedRefs(ref, listRef)}>
        {children}
      </MenuList>
    </StyledPaper>
  )
})

Menu.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.node,
  ]).isRequired,
  anchorEl: PropTypes.object,
  /** Focus menuItem */
  focus: PropTypes.oneOf(['first', 'last']),
  /** Position from left */
  left: PropTypes.number,
  /** Position from top */
  top: PropTypes.number,
  /** onClose handler */
  onClose: PropTypes.func,
  /** Open meny */
  open: PropTypes.bool,
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
  focus: undefined,
  top: 0,
  left: 0,
  onClose: () => {},
  open: false,
}

Menu.displayName = 'eds-menu'
