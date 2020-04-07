import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { spacingsTemplate, typographyTemplate } = templates

const {
  enabled: {
    typography,
    item: {
      spacings,
      active: activeToken,
      focus,
      hover,
      disabled: disabledToken,
    },
  },
} = tokens

const ListItem = styled.li.attrs(({ disabled }) => ({
  role: 'none',
  tabIndex: disabled ? -1 : 0,
}))`
  width: auto;
  position: relative;
  z-index: 2;

  ${typographyTemplate(typography)}
  svg {
    fill: ${typography.color};
  }

  ${({ active }) =>
    active &&
    css`
      background: ${activeToken.background};
      ${typographyTemplate(activeToken.typography)}
      svg {
        fill: ${activeToken.typography.color};
      }
    `}

  &:hover {
    z-index: 1;
    cursor: pointer;
    background: ${hover.background};
  }

  ${({ disabled }) =>
    disabled
      ? css`
          color: ${disabledToken.textColor};
          svg {
            fill: ${disabledToken.iconColor};
          }
          &:focus {
            outline: none;
          }
          &:hover {
            cursor: not-allowed;
          }
        `
      : css`
          &:focus {
            outline: ${focus.outline};
            outline-offset: ${focus.outlineOffset};
          }
        `}
`

const Anchor = styled.a.attrs({ role: 'menuitem' })`
  position: relative;
  width: auto;
  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  grid-auto-columns: min-content auto min-content;
  align-items: center;
  ${spacingsTemplate(spacings)}
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
  /** Disabled Menu Item */
  disabled: PropTypes.bool,
}

MenuItem.defaultProps = {
  className: '',
  children: undefined,
  active: false,
  disabled: false,
}

MenuItem.displayName = 'eds-menu-item'
