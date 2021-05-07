import {
  useEffect,
  useRef,
  HTMLAttributes,
  forwardRef,
  useState,
  cloneElement,
} from 'react'
import * as ReactDom from 'react-dom'
import styled, { css } from 'styled-components'
import { useMenu, MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
  useOutsideClick,
  usePopper,
  Placement,
  useGlobalKeyPress,
  useIsMounted,
} from '../../hooks'
import { bordersTemplate } from '../../utils'
import { menu as tokens } from './Menu.tokens'
import type { FocusTarget } from './Menu.types'
//import { usePopper as reactPopper } from 'react-popper'

type MenuPaperProps = {
  open: boolean
}

const MenuPaper = styled(Paper)<MenuPaperProps>`
  position: absolute;
  z-index: 150;
  width: fit-content;
  min-width: fit-content;
  ${bordersTemplate(tokens.border)};

  ${({ open }) =>
    css({
      visibility: open ? 'visible' : 'hidden',
    })};
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
  const isMounted = useIsMounted()
  const containerRef = useRef<HTMLDivElement>(null)
  const containerId = 'eds-menu-container'
  const shouldOpen = isMounted && open
  // const [anchor, setAnchor] = useState<HTMLElement>(null)

  useEffect(() => {
    if (document.getElementById(containerId) === null) {
      const menuContainerElement = document.createElement('div')
      menuContainerElement.id = containerId
      document.body.appendChild(menuContainerElement)
    }
  }, [])

  const { styles, attributes } = usePopper(
    anchorEl,
    containerRef.current,
    null,
    placement,
    4,
  )

  const props = {
    open,
    style: styles.popper,
    ...attributes.popper,
  }

  const menuProps = {
    ...rest,
    anchorEl,
    open,
    containerRef,
  }

  return shouldOpen
    ? ReactDom.createPortal(
        <MenuPaper elevation="raised" ref={containerRef} {...props}>
          <MenuProvider>
            <MenuContainer {...menuProps} ref={ref} />
          </MenuProvider>
        </MenuPaper>,
        document.getElementById(containerId),
      )
    : null
})
