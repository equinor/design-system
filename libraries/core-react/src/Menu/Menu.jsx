import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { spacingsTemplate, typographyTemplate } = templates

const {
  enabled: { elevation, spacings, typography, background },
} = tokens

const StyledMenu = styled.ul.attrs({ role: 'menu' })`
  display: block;
  position: absolute;
  z-index: 1;
  background: ${background};
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  box-shadow: ${elevation};
  ${typographyTemplate(typography)}
  ${spacingsTemplate(spacings)}
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
    top: rect && rect.height,
    left: rect.y,
  }
  return <StyledMenu {...props} ref={ref} />
})

StyledMenu.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Element the menu is anchored to */
  anchorEl: PropTypes.node,
}

StyledMenu.defaultProps = {
  className: '',
  anchorEl: undefined,
}

StyledMenu.displayName = 'eds-menu'
