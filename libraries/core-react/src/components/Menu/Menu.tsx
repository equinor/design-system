import * as React from 'react'
import { useEffect, useRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { useMenu } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
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

type MenuPaperProps = {
  open: boolean
}

const MenuPaper = styled(Paper)<MenuPaperProps>`
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
  onClose?: () => void
  /** Menu placement relative to anchorEl */
  placement?: Placement
} & HTMLAttributes<HTMLUListElement>

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { children, anchorEl, onClose: onCloseCallback, open, placement, ...rest },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { setOnClose, onClose } = useMenu()

  useOutsideClick(containerRef, (e: MouseEvent) => {
    if (open && onClose !== null && !anchorEl.contains(e.target as Node)) {
      onClose()
    }
  })

  useGlobalKeyPress('Escape', () => {
    if (open && onClose !== null) {
      onClose()
    }
  })

  const { styles, attributes } = usePopper(
    anchorEl,
    containerRef.current,
    null,
    placement,
  )

  useEffect(() => {
    if (onClose === null && onCloseCallback) {
      setOnClose(onCloseCallback)
    }
  })

  const props = {
    open,
    style: styles.popper,
    ...attributes.popper,
  }

  return (
    <MenuPaper elevation="raised" ref={containerRef} {...props}>
      <MenuList {...rest} ref={ref}>
        {children}
      </MenuList>
    </MenuPaper>
  )
})
