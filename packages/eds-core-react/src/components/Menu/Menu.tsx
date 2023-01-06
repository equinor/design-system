import { useEffect, HTMLAttributes, forwardRef, useMemo } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { useMenu, MenuProvider } from './Menu.context'
import { Paper } from '../Paper'
import { MenuList } from './MenuList'
import {
  mergeRefs,
  useGlobalKeyPress,
  useToken,
  bordersTemplate,
  useIsomorphicLayoutEffect,
} from '@equinor/eds-utils'
import { menu as tokens } from './Menu.tokens'
import { useEds } from '../EdsProvider'
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useDismiss,
  FloatingPortal,
} from '@floating-ui/react'

type MenuPaperProps = {
  open: boolean
}

const { border } = tokens

const MenuPaper = styled(Paper)<MenuPaperProps>`
  position: absolute;
  z-index: 1400;
  width: fit-content;
  min-width: fit-content;
  ${bordersTemplate(border)};
  ${({ open }) => css({ display: open ? 'block' : 'none' })};
`

const MenuContainer = forwardRef<HTMLDivElement, MenuProps>(
  function MenuContainer(
    { children, anchorEl, onClose: onCloseCallback, open, ...rest },
    ref,
  ) {
    const { setOnClose, onClose, setInitialFocus, focusedIndex } = useMenu()

    const closeMenuOnClickIndexes: number[] = useMemo<number[]>(() => [], [])

    useEffect(() => {
      if (onClose === null && onCloseCallback) {
        setOnClose(onCloseCallback)
      }
    }, [onClose, onCloseCallback, setOnClose])

    useEffect(() => {
      const openWithKey = (e: KeyboardEvent) => {
        const { key } = e
        //activate menu with arrows according to wai-aria best practices
        if (key === 'ArrowDown' || key === 'ArrowUp') {
          e.preventDefault()
          e.stopPropagation()
          anchorEl.dispatchEvent(new Event('click', { bubbles: true }))
        }
        switch (key) {
          case 'Enter':
          case 'ArrowDown':
            setInitialFocus('first')
            break
          case 'ArrowUp':
            setInitialFocus('last')
            break
          default:
            break
        }
      }
      if (anchorEl) anchorEl.addEventListener('keydown', openWithKey)
      return () => {
        if (anchorEl) anchorEl.removeEventListener('keydown', openWithKey)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchorEl])

    useGlobalKeyPress('Escape', () => {
      if (open && onClose !== null) {
        onClose()
        anchorEl.focus()
      }
    })

    useGlobalKeyPress('Enter', () => {
      if (
        open &&
        onClose !== null &&
        closeMenuOnClickIndexes.includes(focusedIndex)
      ) {
        setTimeout(() => {
          if (window.document.contains(anchorEl)) {
            anchorEl.focus()
          }
        }, 0)
      }
    })

    const addCloseMenuOnClickIndex = (index: number) => {
      if (closeMenuOnClickIndexes.indexOf(index) < 0) {
        closeMenuOnClickIndexes.push(index)
      }
    }

    return (
      <MenuList
        addCloseMenuOnClickIndex={addCloseMenuOnClickIndex}
        {...rest}
        ref={ref}
      >
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
  /** onClose handler */
  onClose?: () => void
  /** Menu placement relative to anchorEl */
  placement?: Placement
} & HTMLAttributes<HTMLDivElement>

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { anchorEl, open, placement = 'bottom', onClose, style, className, ...rest },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, tokens)

  const { x, y, reference, floating, refs, update, strategy, context } =
    useFloating({
      placement,
      open,
      onOpenChange: onClose,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    })

  useEffect(() => {
    reference(anchorEl)
  }, [anchorEl, reference])

  const popoverRef = useMemo(
    () => mergeRefs<HTMLDivElement>(floating, ref),
    [floating, ref],
  )
  useIsomorphicLayoutEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update)
    }
  }, [refs.reference, refs.floating, update, open])

  const { getFloatingProps } = useInteractions([
    useDismiss(context, { escapeKey: false }),
  ])

  const props = {
    open,
    className,
  }

  const menuProps = {
    ...rest,
    onClose,
    anchorEl,
    open,
  }

  return (
    <>
      <FloatingPortal id="eds-menu-container">
        <ThemeProvider theme={token}>
          <MenuPaper
            elevation="raised"
            {...props}
            {...getFloatingProps({
              ref: popoverRef,
              style: {
                ...style,
                position: strategy,
                top: y || 0,
                left: x || 0,
              },
            })}
          >
            <MenuProvider>
              <MenuContainer {...menuProps} ref={ref} />
            </MenuProvider>
          </MenuPaper>
        </ThemeProvider>
      </FloatingPortal>
    </>
  )
})
