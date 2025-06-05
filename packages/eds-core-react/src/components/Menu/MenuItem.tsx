import { MouseEvent, forwardRef, ElementType } from 'react'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import {
  mergeRefs,
  outlineTemplate,
  spacingsTemplate,
  typographyTemplate,
  OverridableComponent,
} from '@equinor/eds-utils'
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
  $active?: boolean
  disabled?: boolean
}

type StyleAttrsProps = {
  $isFocused: string
}

const Item = styled.button.attrs<StyleAttrsProps>(({ $isFocused }) => ({
  role: 'menuitem',
  tabIndex: $isFocused ? -1 : 0,
}))<StyleProps>`
  border: 0;
  background-color: transparent;
  width: auto;
  position: relative;
  z-index: 2;
  text-decoration: none;

  ${typographyTemplate(typography)}
  ${({ theme }) => spacingsTemplate(theme.entities.item.spacings)}

  ${({ $active }) =>
    $active &&
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
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              cursor: not-allowed;
            }
          }
        `
      : css`
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              cursor: pointer;
              background: ${hover.background};
            }
          }
          &:focus-visible {
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
type OverridableSubComponent = OverridableComponent<
  MenuItemProps,
  HTMLButtonElement
> & {
  displayName?: string
}

export type MenuItemProps = {
  /** @ignore */
  index?: number
  /** Is active */
  active?: boolean
  /** Is disabled */
  disabled?: boolean
  /** onClick handler */
  onClick?: (e: React.MouseEvent) => void
  /**
   * Close menu when item is clicked
   * @default true
   */
  closeMenuOnClick?: boolean
  /**
   * Override element type
   * @default 'button'
   */
  as?: ElementType
} & React.HTMLAttributes<HTMLButtonElement>

export const MenuItem: OverridableSubComponent = forwardRef<
  HTMLButtonElement,
  MenuItemProps
>(function MenuItem(
  {
    children,
    disabled,
    active,
    index = 0,
    as = 'button',
    onClick,
    closeMenuOnClick = true,
    ...rest
  },
  ref,
) {
  const { focusedIndex, setFocusedIndex, onClose } = useMenu()

  const toggleFocus = (index_: number) => {
    if (focusedIndex !== index_) {
      setFocusedIndex(index_)
    }
  }

  const isFocused = index === focusedIndex

  const props = {
    ...rest,
    as,
    disabled,
    $isFocused: isFocused,
  }

  return (
    <Item
      {...props}
      $active={active}
      type="button"
      ref={mergeRefs<HTMLButtonElement>(ref, (el) => {
        if (isFocused) {
          requestAnimationFrame(() => {
            if (el !== null) el.focus()
          })
        }
      })}
      onFocus={() => toggleFocus(index)}
      onClick={(e: MouseEvent<Element, globalThis.MouseEvent>) => {
        if (onClick) {
          onClick(e)
        }
        if (onClose !== null && closeMenuOnClick) {
          onClose(e)
        }
      }}
    >
      <Content>{children}</Content>
    </Item>
  )
})

MenuItem.displayName = 'MenuItem'
