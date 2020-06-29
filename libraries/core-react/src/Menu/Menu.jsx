import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'

const StyledPaper = styled(Paper)`
  position: absolute;
  z-index: 500;
  ${({ left, top, open }) =>
    css({ left, top, display: open ? 'block' : 'none' })}
  width: fit-content;
  min-width: fit-content;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Menu = React.forwardRef(function EdsMenu(
  { children, focus, anchorEl, ...rest },
  ref,
) {
  if (!anchorEl) {
    return undefined
  }

  const rect = anchorEl ? anchorEl.getBoundingClientRect() : null
  // console.log(window)
  console.log(rect)
  const props = {
    ...rest,
    top: rect.top + rect.height + 2,
    left: rect.left,
  }
  console.log(children[0])

  return (
    <StyledPaper {...props} elevation="raised" ref={ref}>
      <MenuProvider>
        <MenuList {...props} focus={focus}>
          {children}
        </MenuList>
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
