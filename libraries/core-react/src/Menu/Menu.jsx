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
  display:${({ open }) => (open ? 'block' : 'none')};
  width: fit-content;
  min-width: fit-content;
`

export const Menu = React.forwardRef(function EdsMenu(
  { children, className, ...rest },
  ref,
) {
  return (
    <StyledPaper elevation="raised" className={className} ref={ref}>
      <MenuProvider>
        <MenuList {...rest}>{children}</MenuList>
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
  focus: undefined,
  open: false,
  top: undefined,
  left: undefined,
}

Menu.displayName = 'eds-menu'
