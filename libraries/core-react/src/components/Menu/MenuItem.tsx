import {
  MouseEvent,
  memo,
  forwardRef,
  ReactNode,
  HTMLAttributes,
  Children as ReactChildren,
} from 'react'
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
      spacings,
      states: { active: activeToken, focus, hover, disabled: disabledToken },
    },
    icon,
  },
} = tokens

type StyleProps = {
  active?: boolean
  disabled?: boolean
} & HTMLAttributes<HTMLLIElement>

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

  // Hack to avoid width auto adjusting on hover (bold text)
  ${({ title }) =>
    title &&
    css`
    ::before {
    display: block;
    content: attr(title);
    ${typographyTemplate(hover.typography)}
    height: 0px;
    overflow: hidden;
    visibility: hidden;`}
  }
  
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
          &:hover {
            cursor: not-allowed;
          }
        `
      : css`
          &:hover,
          &:hover p {
            z-index: 1;
            cursor: pointer;
            background: ${hover.background};
            ${typographyTemplate(hover.typography)}
          }
          &:focus {
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
  onClick?: (e: React.MouseEvent) => void
} & React.HTMLAttributes<HTMLLIElement>

export const MenuItem = memo(
  forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(
    { children, disabled, index = 0, onClick, ...rest },
    ref,
  ) {
    const { focusedIndex, setFocusedIndex, onClose } = useMenu()

    const toggleFocus = (index_) => {
      if (focusedIndex !== index_) {
        setFocusedIndex(index_)
      }
    }

    // const updatedChildren = ReactChildren.map(
    //   children,
    //   (child: ReactNode, index: number) => {
    //     if (typeof child === 'string') {
    //       return child
    //     } else if ((child as Object).props?.variant?) {
    //       console.log(child)
    //     }
    //   },
    // )
    //console.log(updatedChildren)

    const isFocused = index === focusedIndex

    const props = {
      ...rest,
      disabled,
      isFocused,
    }

    return (
      <ListItem
        {...props}
        ref={useCombinedRefs<HTMLLIElement>(ref, (el) => {
          if (el !== null && isFocused) {
            el.focus()
          }
        })}
        onFocus={() => toggleFocus(index)}
        onClick={(e) => {
          if (!disabled && onClick) {
            onClick(e)
            if (onClose !== null) {
              onClose(e)
            }
          }
        }}
        title={typeof children === 'string' ? children : ''}
      >
        <Content>{children}</Content>
      </ListItem>
    )
  }),
)

MenuItem.displayName = 'MenuItem'
