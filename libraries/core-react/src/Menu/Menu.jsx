import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'

const pos = ({ left, top }) => css({ left, top })

const StyledPaper = styled(Paper)`
  position: absolute;
  z-index: 1;
  ${pos}
`

export const Menu = React.forwardRef(function EdsMenu(
  { anchorEl, children, focus, ...rest },
  ref,
) {
  if (!anchorEl) {
    return undefined
  }

  // const rect = anchorEl.getBoundingClientRect()

  const props = {
    ...rest,
    // top: rect && rect.x,
    // left: rect.x,
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
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  /** Element the menu is anchored to */
  anchorEl: PropTypes.node,
  /** Focus menuItem */
  focus: PropTypes.oneOf(['first', 'last']),
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
  focus: undefined,
}

Menu.displayName = 'eds-menu'
