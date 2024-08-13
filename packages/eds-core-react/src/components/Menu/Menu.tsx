import { useEffect, HTMLAttributes, forwardRef, useMemo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
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
  size,
  Middleware,
  MiddlewareState,
} from '@floating-ui/react'

const { border } = tokens

const MenuPaper = styled(Paper)`
  width: 100%;
  min-width: fit-content;
  ${bordersTemplate(border)};
`

const StyledPopover = styled('div').withConfig({
  shouldForwardProp: () => true, //workaround to avoid warning until popover gets added to react types
})<{ popover: string }>`
  inset: unset;
  border: 0;
  padding: 0;
  margin: 0;
  overflow: visible;
  background-color: transparent;
  &::backdrop {
    background-color: transparent;
  }
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
  /** Match the width of the menu with the width of the anchorEl */
  matchAnchorWidth?: boolean
} & HTMLAttributes<HTMLDivElement>

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  {
    anchorEl,
    open,
    placement = 'bottom',
    matchAnchorWidth = false,
    onClose,
    style,
    className,
    ...rest
  },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, tokens)
  let floatingMiddleware: Middleware[] = [
    offset(4),
    flip(),
    shift({ padding: 8 }),
  ]
  if (matchAnchorWidth) {
    floatingMiddleware = [
      ...floatingMiddleware,
      size({
        apply({ rects, elements }: MiddlewareState) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
      }),
    ]
  }

  const { x, y, refs, update, strategy, context } = useFloating({
    elements: {
      reference: anchorEl,
    },
    placement,
    open,
    onOpenChange: onClose,
    middleware: floatingMiddleware,
  })

  const popoverRef = useMemo(
    () => mergeRefs<HTMLDivElement>(refs.setFloating, ref),
    [refs.setFloating, ref],
  )
  useIsomorphicLayoutEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update)
    }
  }, [refs.reference, refs.floating, update, open])

  useIsomorphicLayoutEffect(() => {
    if (open) {
      refs.floating.current?.showPopover()
    } else {
      refs.floating.current?.hidePopover()
    }
  }, [open, refs.floating])

  const { getFloatingProps } = useInteractions([
    useDismiss(context, { escapeKey: false }),
  ])

  const props = {
    className,
  }

  const menuProps = {
    ...rest,
    onClose,
    anchorEl,
    open,
  }

  return (
    <ThemeProvider theme={token}>
      <StyledPopover
        popover="manual"
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
        <MenuPaper elevation="raised" {...props}>
          <MenuProvider>
            <MenuContainer {...menuProps} ref={ref} />
          </MenuProvider>
        </MenuPaper>
      </StyledPopover>
    </ThemeProvider>
  )
})
