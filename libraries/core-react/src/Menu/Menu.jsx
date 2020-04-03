import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { typographyTemplate } = templates

const {
  enabled: { elevation, spacings, typography, background },
} = tokens

const StyledMenu = styled.ul.attrs({ role: 'menu' })`
  display: block;
  width: fit-content;
  position: absolute;
  padding: 0;
  z-index: 1;
  min-width: 168px;
  background: ${background};
  box-shadow: ${elevation};
`

export const Menu = React.forwardRef(function EdsMenu(
  { anchorEl, ...rest },
  ref,
) {
  if (!anchorEl) {
    return undefined
  }
  const rect = anchorEl ? anchorEl.getBoundingClientRect() : null
  console.log(rect)
  const props = {
    ...rest,
    top: rect && rect.y,
    left: rect.y,
  }
  return <StyledMenu {...props} ref={ref} />
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
