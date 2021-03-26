import * as React from 'react'
import { useEffect, useRef, ReactNode, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
  useCombinedRefs,
  useOutsideClick,
  usePopper,
  Placement,
  useGlobalKeyPress,
} from '@hooks'
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
  anchorEl: HTMLElement
  /** Is Menu open */
  open: boolean
  /** Which Menu child to focus when open */
  focus?: FocusTarget
  /** onClose handler */
  onClose?: (e?: React.MouseEvent<ReactNode, MouseEvent>) => void
  /** Menu placement relative to anchorEl */
  placement?: Placement
} & HTMLAttributes<HTMLUListElement>

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(function Menu(
  {
    children,
    anchorEl,
    onClose: onCloseCallback,
    open = false,
    placement,
    ...rest
  },
  ref,
) {
  const listRef = useRef<HTMLUListElement>(null)
  const popperRef = useRef<HTMLDivElement | null>(null)

  const { setOnClose, onClose } = useMenu()

  useOutsideClick(listRef, (e: MouseEvent) => {
    if (open && onClose !== null && !anchorEl.contains(e.target as Node)) {
      onClose()
    }
  })

  useGlobalKeyPress('Escape', () => {
    if (onClose !== null) {
      onClose()
    }
  })

  const { styles, attributes } = usePopper(
    anchorEl,
    popperRef.current,
    null,
    placement,
  )

  useEffect(() => {
    if (onClose === null && onCloseCallback) {
      setOnClose(onCloseCallback)
    }
  }, [listRef.current])

  const props = {
    open,
    style: styles.popper,
    ...attributes.popper,
  }

  return (
    <StyledPaper elevation="raised" ref={popperRef} {...props}>
      <MenuList {...rest} ref={useCombinedRefs<HTMLUListElement>(ref, listRef)}>
        {children}
      </MenuList>
    </StyledPaper>
  )
})
