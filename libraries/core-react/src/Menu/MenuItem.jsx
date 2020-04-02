import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'

const ListItem = styled.li.attrs({ role: 'none' })`
  list-style: none;
`

const Anchor = styled.a.attrs({ role: 'menuitem' })`
  display: flex;
  justify-content: space-between;
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

ListItem.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.element.isRequired,
}

ListItem.defaultProps = {
  className: '',
  children: undefined,
}

ListItem.displayName = 'eds-menu-item'
