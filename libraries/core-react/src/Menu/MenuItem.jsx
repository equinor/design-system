import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates, useCombinedRefs } from '../_common'
import { useMenu } from './Menu.context'

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
          &:hover {
            z-index: 1;
            cursor: pointer;
            background: ${hover.background};
          }
          &:focus {
            outline: ${focus.outline};
            outline-offset: ${focus.outlineOffset};
          }
        `}
`

const Anchor = styled.span.attrs({ role: 'menuitem' })`
  position: relative;
  width: auto;
  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  grid-auto-columns: min-content auto min-content;
  align-items: center;
  ${spacingsTemplate(spacings)};
`

const defaultState = {
  isOpenSubmenu: false,
  rect: undefined,
}

export const MenuItem = React.memo(
  React.forwardRef(function EdsMenuItem(
    { children, disabled, index, ...rest },
    ref,
  ) {
    const { focusedIndex, setFocusedIndex } = useMenu()
    const [state, setState] = useState(defaultState)
    const { isOpenSubmenu, left, top } = state

    const toggleFocus = (index_) => {
      if (focusedIndex !== index_) {
        setFocusedIndex(index_)
      }
    }

    const toggleSubmenu = (e, hasSubMenu) => {
      const rect = e.currentTarget.getBoundingClientRect()

      const offsett = rect ? rect.width + 8 : 0
      const updatedIsOpenSubmenu = hasSubMenu
        ? !state.isOpenSubmenu
        : state.isOpenSubmenu

      setState({
        ...state,
        isOpenSubmenu: updatedIsOpenSubmenu,
        left: updatedIsOpenSubmenu ? offsett : undefined,
        top: 0,
      })
    }

    const setSubMenu = (isOpenSubmenu) => setState({ ...state, isOpenSubmenu })

    const isFocused = index === focusedIndex

    const updatedChildren = React.Children.map(children, (child) => {
      // We force size on Icon & Avatar component

      if (child.props) {
        return React.cloneElement(child, {
          disabled,
          isopen: isOpenSubmenu,
          left,
          top,
        })
      }
      return child
    })

    const hasSubMenu =
      updatedChildren.filter((child) => child.type.displayName === 'eds-menu')
        .length > 0

    const props = {
      ...rest,
      disabled,
    }

    const openSubMenu = (e) => {
      e.stopPropagation()
      if (hasSubMenu) {
        toggleSubmenu(e, hasSubMenu)
      }
    }
    return (
      <ListItem
        {...props}
        ref={useCombinedRefs(ref, (el) => isFocused && el.focus())}
        onFocus={() => toggleFocus(index)}
        onClick={hasSubMenu ? openSubMenu : undefined}
      >
        <Anchor>{updatedChildren}</Anchor>
      </ListItem>
    )
  }),
)

MenuItem.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  index: PropTypes.number,
  /** @ignore */
  children: PropTypes.oneOf([
    PropTypes.element,
    PropTypes.arrayOf([PropTypes.element]),
  ]),
  /** Active Menu Item */
  active: PropTypes.bool,
  /** Disabled Menu Item */
  disabled: PropTypes.bool,
}

MenuItem.defaultProps = {
  className: '',
  active: false,
  disabled: false,
  index: 0,
  children: undefined,
}

MenuItem.displayName = 'eds-menu-item'
