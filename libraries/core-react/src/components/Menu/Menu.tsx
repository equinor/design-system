import { useEffect, useRef, HTMLAttributes, forwardRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useMenu, MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
  useOutsideClick,
  usePopper,
  Placement,
  useGlobalKeyPress,
} from '../../hooks'
import { bordersTemplate } from '../../utils'
import { menu as tokens } from './Menu.tokens'
import type { FocusTarget } from './Menu.types'
import { usePopper as reactPopper } from 'react-popper'

type MenuPaperProps = {
  open: boolean
}

const MenuPaper = styled(Paper)<MenuPaperProps>`
  position: absolute;
  z-index: 150;
  width: fit-content;
  min-width: fit-content;
  ${bordersTemplate(tokens.border)};

  /* ${({ open }) =>
    css({
      visibility: open ? 'visible' : 'hidden',
    })}; */
`
type MenuContainerProps = MenuProps & {
  containerRef: React.MutableRefObject<HTMLDivElement>
}
const MenuContainer = forwardRef<HTMLUListElement, MenuContainerProps>(
  function MenuContainer(
    {
      children,
      anchorEl,
      onClose: onCloseCallback,
      open,
      containerRef,
      ...rest
    },
    ref,
  ) {
    const { setOnClose, onClose } = useMenu()

    useEffect(() => {
      if (onClose === null && onCloseCallback) {
        setOnClose(onCloseCallback)
      }
    })

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

    return (
      <MenuList {...rest} ref={ref}>
        {children}
      </MenuList>
    )
  },
)

export type MenuProps = {
  /** Anchor element for Menu */
  anchorEl?: HTMLElement | null
  /** Is Menu open */
  open: boolean
  /** Which Menu child to focus when open */
  focus?: FocusTarget
  /** onClose handler */
  onClose?: () => void
  /** Menu placement relative to anchorEl */
  placement?: Placement
} & HTMLAttributes<HTMLUListElement>

export const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { anchorEl, open, placement = 'auto', ...rest },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)

  // const { styles, attributes } = usePopper(
  //   anchorEl,
  //   containerRef.current,
  //   null,
  //   placement,
  //   4,
  // )
  const [anchor, setAnchor] = useState<HTMLElement>(null)

  useEffect(() => {
    if (anchorEl && anchorEl !== anchor) {
      setAnchor(anchorEl)
    }
  }, [anchorEl])

  const { styles, attributes } = reactPopper(anchor, containerRef.current, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ],
  })

  const props = {
    open,
    style: styles.popper,
    ...attributes.popper,
  }

  const menuProps = {
    ...rest,
    anchorEl: anchor,
    open,
    containerRef,
  }

  console.log(anchor, anchorEl)

  return open ? (
    <MenuPaper elevation="raised" ref={containerRef} {...props}>
      <MenuProvider>
        <MenuContainer {...menuProps} ref={ref} />
      </MenuProvider>
    </MenuPaper>
  ) : null
})
