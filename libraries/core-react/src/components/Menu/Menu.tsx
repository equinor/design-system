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
import { useCombinedRefs, useOutsideClick, Placement } from '@hooks'
import { menu as tokens } from './Menu.tokens'
import type { FocusTarget } from './Menu.types'
import { usePopper } from 'react-popper'

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
  const [popperEl, setPopperEl] = useState<HTMLDivElement>(null)

  const { setOnClose, onClose } = useMenu()

  const { styles, attributes } = usePopper(anchorEl, null, {
    placement,
    modifiers: [
      // {
      //   name: 'arrow',
      //   options: {
      //     element: arrowRef,
      //   },
      // },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  })

  // useOutsideClick(listRef, () => {
  //   if (open && onClose !== null) {
  //     onClose()
  //   }
  // })

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

  // const { styles, attributes } = usePopper(
  //   anchorEl,
  //   popperRef.current,
  //   null,
  //   placement,
  // )

  const menuProps = {
    ...rest,
  }

  const props = {
    open,
    style: styles.popper,
    ...attributes.popper,
  }

  //if (!open) return null

  return (
    <StyledPaper elevation="raised" ref={setPopperEl} {...props}>
      <MenuList
        {...menuProps}
        ref={useCombinedRefs<HTMLUListElement>(ref, listRef)}
      >
        {children}
      </MenuList>
    </StyledPaper>
  )
})
