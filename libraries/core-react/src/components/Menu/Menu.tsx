import * as React from 'react'
import {
  useEffect,
  useRef,
  ReactNode,
  HTMLAttributes,
  MutableRefObject,
} from 'react'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import { useCombinedRefs, useOutsideClick, usePopper } from '@hooks'
import { menu as tokens } from './Menu.tokens'
import type { FocusTarget } from './Menu.types'

const {
  enabled: { border },
} = tokens

type StyledProps = {
  open: boolean
}

const StyledPaper = styled(Paper)<StyledProps>`
  position: absolute;
  z-index: 150;
  width: fit-content;
  min-width: fit-content;
  border-radius: ${border.radius};

  ${({ open }) =>
    css({
      visibility: open ? 'visible' : 'hidden',
    })};
`

export type MenuProps = {
  /** Anchor element for Menu */
  anchorEl: MutableRefObject<null>
  /** Is Menu open */
  open: boolean
  /** Which Menu child to focus when open */
  focus?: FocusTarget
  /** onClose handler */
  onClose?: (e?: React.MouseEvent<ReactNode, MouseEvent>) => void
} & HTMLAttributes<HTMLUListElement>

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { children, anchorEl, onClose: onCloseCallback, open = false, ...rest },
  ref,
) {
  const listRef = useRef<HTMLUListElement>(null)

  const { position, isPositioned, setOnClose, onClose } = useMenu()
  useOutsideClick(listRef, () => {
    if (open && onClose !== null) {
      onClose()
    }
  })

  useEffect(() => {
    if (onClose === null && onCloseCallback) {
      setOnClose(onCloseCallback)
    }

    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [listRef.current])

  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        onClose()
        break
      default:
        break
    }
  }

  const popperRef = useRef<HTMLDivElement | null>(null)
  const placement = 'right-end'

  // React Popper example
  const { styles, attributes } = usePopper(
    anchorEl as MutableRefObject<HTMLElement>,
    popperRef,
    null,
    placement,
  )

  const paperProps = {
    ...position,
    open,
    isPositioned,
  }

  const menuProps = {
    ...rest,
  }

  return (
    anchorEl && (
      <StyledPaper
        {...paperProps}
        elevation="raised"
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
      >
        <MenuList
          {...menuProps}
          ref={useCombinedRefs<HTMLUListElement>(ref, listRef)}
        >
          {children}
        </MenuList>
      </StyledPaper>
    )
  )
})
