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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${({ left, top, open, transform, visibility }) =>
    css({ left, top, transform, visibility, display: open ? 'block' : 'none' })}
`

export const Menu = React.forwardRef(function EdsMenu(
  { children, className, anchorEl, open, ...rest },
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
  }, [anchorEl])

  // console.log(window)
  // console.log(rect)
  const paperProps = {
    visibility,
    open,
    className,
    ...position,
  }

  return (
    <StyledPaper {...paperProps} elevation="raised">
      <MenuList {...rest} focus={focus} ref={ref}>
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
  /** Toggle for displaying menu */
  open: PropTypes.bool,
  /** Position from left */
  left: PropTypes.number,
  /** Position from top */
  top: PropTypes.number,
  /** @ignore */
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
  focus: undefined,
  open: false,
  top: 0,
  left: 0,
}

Menu.displayName = 'eds-menu'
