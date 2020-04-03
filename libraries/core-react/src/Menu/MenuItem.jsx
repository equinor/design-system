import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { spacingsTemplate, typographyTemplate } = templates

const {
  enabled: {
    typography,
    item: { spacings, active: activeToken },
  },
} = tokens

const ListItem = styled.li.attrs({ role: 'none' })`
  width: 100%;
  position: relative;
  display: block;
  list-style: none;

  ${({ active }) =>
    typographyTemplate(active ? activeToken.typography : typography)}
  ${({ active }) => active && css({ background: activeToken.background })}
`

const Anchor = styled.a.attrs({ role: 'menuitem' })`
  display: flex;
  justify-content: space-between;
  width: 100%;
  ${spacingsTemplate(spacings)}

  &:hover {
    background: red;
  }
`

export const MenuItem = React.forwardRef(function EdsMenuItem(
  { children, ...rest },
  ref,
) {
  return (
    <ListItem {...rest} ref={ref}>
      <Anchor>{children}</Anchor>
    </ListItem>
  )
})

MenuItem.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.element,
  /** Active Menu Item */
  active: PropTypes.bool,
}

MenuItem.defaultProps = {
  className: '',
  children: undefined,
  active: false,
}

MenuItem.displayName = 'eds-menu-item'
