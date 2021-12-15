import { useEffect, HTMLAttributes, forwardRef, useState } from 'react'
import * as ReactDom from 'react-dom'
import styled, { css, ThemeProvider } from 'styled-components'
import { useMenu, MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
  useOutsideClick,
  usePopper,
  Placement,
  useGlobalKeyPress,
  useIsMounted,
  useToken,
} from '../../hooks'
import { bordersTemplate } from '../../utils'
import { menu as tokens } from './Menu.tokens'
import type { FocusTarget } from './Menu.types'
import { useEds } from '../EdsProvider'

type MenuPaperProps = {
  open: boolean
}

const { border } = tokens

const MenuPaper = styled(Paper)<MenuPaperProps>`
  position: absolute;
  z-index: 300;
  width: fit-content;
  min-width: fit-content;
  ${bordersTemplate(border)};
  ${({ open }) => css({ visibility: open ? null : 'hidden' })}
`
type MenuContainerProps = MenuProps & {
  containerEl: HTMLElement
}

const MenuContainer = forwardRef<HTMLDivElement, MenuContainerProps>(
  function MenuContainer(
    {
      children,
      anchorEl,
      onClose: onCloseCallback,
      open,
      containerEl,
      ...rest
    },
    ref,
  ) {
    const { setOnClose, onClose } = useMenu()

    useEffect(() => {
      if (onClose === null && onCloseCallback) {
        setOnClose(onCloseCallback)
      }
    }, [onClose, onCloseCallback, setOnClose])

    useOutsideClick(containerEl, (e: MouseEvent) => {
      if (open && onClose !== null && !anchorEl.contains(e.target as Node)) {
        onClose()
      }
    })

    useGlobalKeyPress('Escape', () => {
      if (open && onClose !== null) {
        onClose()
        anchorEl.focus()
      }
    })

    useGlobalKeyPress('Enter', () => {
      if (open && onClose !== null) {
        if (window.document.contains(anchorEl)) anchorEl.focus()
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
} & HTMLAttributes<HTMLDivElement>

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { anchorEl, open, placement = 'auto', style, className, ...rest },
  ref,
) {
  const [containerEl, setContainerEl] = useState<HTMLElement>(null)
  const [storedAnchorEl, setStoredAnchorEl] = useState<HTMLElement>(null)
  const isMounted = useIsMounted()
  const { density } = useEds()
  const token = useToken({ density }, tokens)

  useEffect(() => {
    open ? setStoredAnchorEl(anchorEl) : setStoredAnchorEl(null)
  }, [anchorEl, open])

  const { styles, attributes } = usePopper(
    storedAnchorEl,
    containerEl,
    null,
    placement,
    4,
  )

  const props = {
    open,
    style: { ...styles.popper, ...style },
    className,
    ...attributes.popper,
  }

  const menuProps = {
    ...rest,
    anchorEl,
    open,
    containerEl,
  }

  return (
    <>
      {isMounted &&
        ReactDom.createPortal(
          <ThemeProvider theme={token}>
            <MenuPaper elevation="raised" ref={setContainerEl} {...props}>
              <MenuProvider>
                <MenuContainer {...menuProps} ref={ref} />
              </MenuProvider>
            </MenuPaper>
          </ThemeProvider>,
          document.body,
        )}
    </>
  )
})
