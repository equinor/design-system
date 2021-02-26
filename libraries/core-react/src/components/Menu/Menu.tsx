import * as React from 'react'
import {
  useEffect,
  useState,
  useRef,
  ReactNode,
  HTMLAttributes,
  MutableRefObject,
} from 'react'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import { useCombinedRefs, useOutsideClick, usePopper, Placement } from '@hooks'
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
  const popperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // useOutsideClick(listRef, () => {
  //   if (open && onClose !== null) {
  //     onClose()
  //   }
  // })
  const { setOnClose, onClose } = useMenu()
  useEffect(() => {
    if (onClose === null && onCloseCallback) {
      setOnClose(onCloseCallback)
    }

    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [open, listRef.current])

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

  const { styles, attributes } = usePopper(
    anchorEl,
    popperRef.current,
    null,
    placement,
  )

  const props = {
    open,
    ...attributes.popper,
  }

  const menuProps = {
    ...rest,
  }

  return (
    <StyledPaper
      elevation="raised"
      ref={popperRef}
      style={styles.popper}
      {...props}
    >
      <MenuList
        {...menuProps}
        ref={useCombinedRefs<HTMLUListElement>(ref, listRef)}
      >
        {children}
      </MenuList>
    </StyledPaper>
  )
})
