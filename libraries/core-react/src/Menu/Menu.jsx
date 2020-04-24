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
  { anchorEl, children, ...rest },
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

  return (
    <StyledPaper elevation="raised" {...props} ref={ref}>
      <MenuProvider>
        <MenuList>{children}</MenuList>
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
}

Menu.defaultProps = {
  className: '',
  anchorEl: undefined,
}

Menu.displayName = 'eds-menu'
