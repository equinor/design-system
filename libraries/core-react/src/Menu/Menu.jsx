import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'

const StyledPaper = styled(Paper)`
  position: absolute;
  z-index: 1;
  ${({ left, top }) => css({ left, top })}
  display:${({ isopen }) => (isopen ? 'block' : 'none')};
  width: fit-content;
  min-width: fit-content;
`

export const Menu = React.forwardRef(function EdsMenu(
  { anchorEl, children, focus, ...rest },
  ref,
) {
  // const rect = anchorEl.getBoundingClientRect()

  const props = {
    ...rest,
  }

  const menuListProps = {
    focus,
  }

  return (
    <StyledPaper elevation="raised" {...props} ref={ref}>
      <MenuProvider>
        <MenuList {...menuListProps}>{children}</MenuList>
      </MenuProvider>
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
  /** Element the menu is anchored to */
  anchorEl: PropTypes.node,
  /** Focus menuItem */
  focus: PropTypes.oneOf(['first', 'last']),
  /** Toggle for displaying menu */
  isopen: PropTypes.bool,
  /** Position from left */
  left: PropTypes.number,
  /** Position from top */
  top: PropTypes.number,
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
  focus: undefined,
  isopen: false,
  top: undefined,
  left: undefined,
}

Menu.displayName = 'eds-menu'
