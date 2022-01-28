import { MouseEvent, memo, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { useCombinedRefs } from '../../hooks'
import {
  outlineTemplate,
  spacingsTemplate,
  typographyTemplate,
} from '../../utils'
import { useMenu } from './Menu.context'

const {
  typography,
  entities: {
    item: {
      states: { active: activeToken, focus, hover, disabled: disabledToken },
    },
    icon,
  },
} = tokens

type StyleProps = {
  active?: boolean
  disabled?: boolean
}

type StyleAttrsProps = {
  isFocused: string
}

const Item = styled.button.attrs<StyleAttrsProps>(({ isFocused }) => ({
  role: 'menuitem',
  tabIndex: isFocused ? -1 : 0,
}))<StyleProps>`
  border: 0;
  background-color: transparent;
  width: auto;
  position: relative;
  z-index: 2;

  ${typographyTemplate(typography)}
  ${({ theme }) => spacingsTemplate(theme.entities.item.spacings)}

  ${({ active }) =>
    active &&
    css`
      background: ${activeToken.background};
      * {
        color: ${activeToken.typography.color};
      }
    `}

  ${({ disabled }) =>
    disabled
      ? css`
          * {
            color: ${disabledToken.typography.color};
          }
          svg {
            fill: ${icon.states.disabled.typography.color};
          }
          &:focus {
            outline: none;
          }
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              cursor: not-allowed;
            }
          }
        `
      : css`
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              z-index: 1;
              cursor: pointer;
              background: ${hover.background};
            }
          }
          &:focus {
            z-index: 3;
            ${outlineTemplate(focus.outline)}
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
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void
} & React.HTMLAttributes<HTMLButtonElement>

export const MenuItem = memo(
  forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const { key } = e
      if (key === 'Enter') {
        if (onClick) {
          onClick(e)
        }
      }
    }

    const props = {
      ...rest,
      disabled,
      isFocused,
    }

    return (
      <Item
        {...props}
        ref={useCombinedRefs<HTMLButtonElement>(ref, (el) => {
          if (el !== null && isFocused) {
            el.focus()
          }
        })}
        onFocus={() => toggleFocus(index)}
        onClick={(e) => {
          if (onClick) {
            onClick(e)
            if (onClose !== null) {
              onClose(e)
            }
          }
        }}
        onKeyDown={handleKeyPress}
      >
        <Content>{children}</Content>
      </Item>
    )
  }),
)

MenuItem.displayName = 'MenuItem'
