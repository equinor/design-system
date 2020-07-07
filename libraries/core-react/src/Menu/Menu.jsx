import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'

const StyledPaper = styled(Paper)`
  position: absolute;
  z-index: 1;
  width: fit-content;
  min-width: fit-content;

  ${({ left, top, transform, visibility }) =>
    css({ left, top, transform, visibility, display: 'block' })}
`

export const Menu = React.forwardRef(function EdsMenu(
  { children, anchorEl, onClose, ...rest },
  ref,
) {
  if (!anchorEl) {
    return undefined
  }
  const { setPosition, position, visibility } = useMenu()

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl ? anchorEl.getBoundingClientRect() : null
      setPosition(rect)
    }

    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [anchorEl])

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
    visibility,
    ...position,
  }

  return (
    <StyledPaper {...paperProps} elevation="raised">
      <MenuList {...rest} ref={ref}>
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
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
  focus: undefined,
  top: 0,
  left: 0,
  onClose: () => {},
}

Menu.displayName = 'eds-menu'
