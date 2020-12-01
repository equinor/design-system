import * as React from 'react'
import { MouseEvent } from 'react'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { useCombinedRefs } from '@hooks'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { useMenu } from './Menu.context'

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
  active?: boolean
  disabled?: boolean
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

export type MenuItemProps = {
  /** @ignore */
  index?: number
  /** Is active */
  active?: boolean
  /** Is disabled */
  disabled?: boolean
  /** onClick handler */
  onClick?: (e: React.MouseEvent) => void
} & React.HTMLAttributes<HTMLLIElement>

export const MenuItem = React.memo(
  React.forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(
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
        ref={useCombinedRefs<HTMLLIElement>(
          ref,
          (el: HTMLLIElement) => isFocused && el.focus(),
        )}
        onFocus={() => toggleFocus(index)}
        onClick={(e) => {
          if (!disabled && onClick) {
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

MenuItem.displayName = 'MenuItem'
