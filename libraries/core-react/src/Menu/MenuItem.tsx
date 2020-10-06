import React from 'react'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates, useCombinedRefs } from '../_common'
import { useMenu } from './Menu.context'
import type { ReactMouseEvent } from './types'

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

type StyleProps = {
  active: boolean
  disabled: boolean
}

type StyleAttrsProps = {
  isFocused: string
}

const ListItem = styled.li.attrs<StyleAttrsProps>(({ isFocused }) => ({
  role: 'menuitem',
  tabIndex: isFocused ? -1 : 0,
}))<StyleProps>`
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

type Props = {
  index: number
  active: boolean
  disabled: boolean
  onClick: (e: ReactMouseEvent<HTMLLIElement>) => void
}

export const MenuItem = React.memo(
  React.forwardRef<HTMLLIElement, Props>(function EdsMenuItem(
    { children, disabled, index = 0, onClick, ...rest },
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
      isFocused,
    }

    return (
      <ListItem
        {...props}
        ref={useCombinedRefs(ref, (el: HTMLElement) => isFocused && el.focus())}
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

MenuItem.displayName = 'eds-menu-item'
