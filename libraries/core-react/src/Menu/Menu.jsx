import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'

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
  { anchorEl, ...rest },
  ref,
) {
  if (!anchorEl) {
    return undefined
  }
  const rect = anchorEl ? anchorEl.getBoundingClientRect() : null
  const props = {
    ...rest,
    top: rect && rect.y,
    left: rect.y,
  }
  return (
    <Paper>
      <StyledMenu {...props} ref={ref} />
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
