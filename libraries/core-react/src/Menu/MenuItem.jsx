import React from 'react'
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
  role: 'menuitem',
  tabIndex: disabled ? -1 : 0,
}))`
  width: auto;
  position: relative;
  z-index: 2;

  ${typographyTemplate(typography)}
  ${spacingsTemplate(spacings)};

  ${({ active }) =>
    active &&
    css`
      background: ${activeToken.background};
      * {
        color: ${activeToken.textColor};
      }
    `}

  ${({ disabled }) =>
    disabled
      ? css`
          * {
            color: ${disabledToken.textColor};
          }
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

const Content = styled.div`
  width: auto;
  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  grid-auto-columns: max-content auto max-content;
  align-items: center;
`

export const MenuItem = React.memo(
  React.forwardRef(function EdsMenuItem(
    { children, disabled, index, onClick, ...rest },
    ref,
  ) {
    const { focusedIndex, setFocusedIndex, onClose } = useMenu()

    const toggleFocus = (index_) => {
      if (focusedIndex !== index_) {
        setFocusedIndex(index_)
      }
    }

    const isFocused = index === focusedIndex

    const props = {
      ...rest,
      disabled,
    }

    return (
      <ListItem
        {...props}
        ref={useCombinedRefs(ref, (el) => isFocused && el.focus())}
        onFocus={() => toggleFocus(index)}
        onClick={(e) => {
          if (!disabled) {
            onClick(e)
            if (onClose !== null) {
              onClose(e)
            }
          }
        }}
      >
        <Content>{children}</Content>
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.node,
  ]).isRequired,
  /** Active Menu Item */
  active: PropTypes.bool,
  /** Disabled Menu Item */
  disabled: PropTypes.bool,
  /** onClick handler */
  onClick: PropTypes.func,
}

MenuItem.defaultProps = {
  className: '',
  active: false,
  disabled: false,
  index: 0,
  onClick: () => {},
}

MenuItem.displayName = 'eds-menu-item'
