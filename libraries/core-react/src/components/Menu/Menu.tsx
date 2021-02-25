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
  anchorEl: MutableRefObject<null>
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
  const [anchorElem, setAnchorEl] = useState(null)
  const [popperEl, setPopperEl] = useState(null)

  const popperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (anchorEl.current && popperRef.current) {
      setAnchorEl(anchorEl.current)
      setPopperEl(popperRef.current)
    }
  }, [anchorElem, popperRef])

  const listRef = useRef<HTMLUListElement>(null)

  const { setOnClose, onClose } = useMenu()
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

  const { styles, attributes } = usePopper(
    anchorElem,
    popperEl,
    null,
    placement,
  )

  const props = {
    ...attributes.popper,
    open,
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
