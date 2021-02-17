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
  z-index: 150;
  width: fit-content;
  min-width: fit-content;
  border-radius: ${border.radius};

  ${({ left, top, transform, open, isPositioned }) =>
    css({
      // left,
      // top,
      // transform,
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
  /** Anchor element for Popper */
  referenceEl?: MutableRefObject<null>
} & HTMLAttributes<HTMLUListElement>

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(function Menu(
  {
    children,
    anchorEl,
    onClose: onCloseCallback,
    open = false,
    referenceEl,
    ...rest
  },
  ref,
) {
  const listRef = useRef<HTMLUListElement>(null)

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

  // React Popper example
  const popperRef = useRef<HTMLDivElement | null>(null)
  // const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
  const placement = 'right-end'
  const { styles, attributes } = usePopper(
    referenceEl,
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
})

// Menu.displayName = 'EdsMenu'
