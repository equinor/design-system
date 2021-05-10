import {
  useEffect,
  HTMLAttributes,
  forwardRef,
  useState,
  useRef,
  MutableRefObject,
} from 'react'
import styled from 'styled-components'
import { useMenu, MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
  useOutsideClick,
  usePopper,
  Placement,
  useGlobalKeyPress,
  useCombinedRefs,
} from '../../hooks'
import { bordersTemplate } from '../../utils'
import { menu as tokens } from './Menu.tokens'
import type { FocusTarget } from './Menu.types'

type MenuPaperProps = {
  open: boolean
}

const MenuPaper = styled(Paper)<MenuPaperProps>`
  position: absolute;
  z-index: 150;
  width: fit-content;
  min-width: fit-content;
  ${bordersTemplate(tokens.border)};
`
type MenuContainerProps = MenuProps & {
  containerRef: MutableRefObject<HTMLElement>
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
  { anchorEl, open: openProp, placement = 'auto', ...rest },
  ref,
) {
  const [open, setOpen] = useState(openProp)
  const [containerElement, setContainerElement] = useState<HTMLElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const combinedRefs = useCombinedRefs(setContainerElement, containerRef)

  const { styles, attributes } = usePopper(
    anchorEl,
    containerElement,
    null,
    placement,
    4,
  )

  useEffect(() => {
    if (open !== openProp) {
      setOpen(openProp)
    }
  }, [openProp])

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
    //containerRef: (setContainerElement as unknown) as MutableRefObject<HTMLElement>,
    //containerRef: combinedRefs,
  }

  return (
    <>
      {open && (
        <MenuPaper
          elevation="raised"
          ref={combinedRefs as React.Ref<HTMLDivElement>}
          {...props}
        >
          <MenuProvider>
            <MenuContainer {...menuProps} ref={ref} />
          </MenuProvider>
        </MenuPaper>
      )}
    </>
  )
})
