import { useEffect, useRef, ReactNode, HTMLAttributes } from 'react'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import { useCombinedRefs } from '../_common'
import { useOutsideClick } from '../_common/hooks'
import { menu as tokens } from './Menu.tokens'
import type { State } from './Menu.context'
import type { FocusTarget } from './Menu.types'

const {
  enabled: { border },
} = tokens

type StyledProps = {
  isPositioned: State['isPositioned']
  open: boolean
} & State['position']

const StyledPaper = styled(Paper)<StyledProps>`
  position: absolute;
  z-index: 1;
  width: fit-content;
  min-width: fit-content;
  border-radius: ${border.radius};

  ${({ left, top, transform, open, isPositioned }) =>
    css({
      left,
      top,
      transform,
      visibility: open && isPositioned ? 'visible' : 'hidden',
    })};
`

export type MenuProps = {
  /** Anchor element for Menu */
  anchorEl: HTMLElement
  /** Is Menu open */
  open: boolean
  /** Which Menu child to focus when open */
  focus?: FocusTarget
  /** onClose handler */
  onClose?: (e?: React.MouseEvent<ReactNode, MouseEvent>) => void
} & HTMLAttributes<HTMLDivElement>

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { children, anchorEl, onClose: onCloseCallback, open = false, ...rest },
  ref,
) {
  const listRef = useRef<HTMLLIElement>(null)

  const { setPosition, position, isPositioned, setOnClose, onClose } = useMenu()
  useOutsideClick(listRef, () => {
    if (open && onClose !== null) {
      onClose()
    }
  })

  useEffect(() => {
    if (anchorEl && listRef.current) {
      const menuRect = listRef.current.getBoundingClientRect()
      const anchorRect = anchorEl.getBoundingClientRect()
      setPosition(anchorRect, menuRect, window)
    }

    if (onClose === null && onCloseCallback) {
      setOnClose(onCloseCallback)
    }

    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [anchorEl, listRef.current])

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

  const paperProps = {
    ...position,
    open,
    isPositioned,
  }

  const menuProps = {
    ...rest,
  }

  return (
    <StyledPaper {...paperProps} elevation="raised">
      <MenuList {...menuProps} ref={useCombinedRefs(ref, listRef)}>
        {children}
      </MenuList>
    </StyledPaper>
  )
})

// Menu.displayName = 'EdsMenu'
