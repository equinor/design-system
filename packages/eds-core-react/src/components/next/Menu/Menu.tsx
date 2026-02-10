import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
  Children,
  isValidElement,
  cloneElement,
} from 'react'
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useInteractions,
  useDismiss,
} from '@floating-ui/react'
import type { MenuProps, MenuItemProps, MenuSectionProps } from './Menu.types'

// ---- Context ----

type MenuContextValue = {
  onClose?: () => void
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  registerItem: (index: number, disabled: boolean) => void
  itemCount: number
}

const MenuContext = createContext<MenuContextValue | null>(null)

function useMenuContext() {
  return useContext(MenuContext)
}

// ---- MenuItem ----

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  function MenuItem(
    {
      active,
      disabled = false,
      closeMenuOnClick = true,
      as: Component = 'button',
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) {
    const classes = ['eds-menu__item', className].filter(Boolean).join(' ')
    const context = useMenuContext()
    const internalRef = useRef<HTMLButtonElement>(null)
    const itemRef = (ref as React.RefObject<HTMLButtonElement>) || internalRef

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        onClick?.(e)
        if (closeMenuOnClick && context?.onClose) {
          context.onClose()
        }
      },
      [disabled, onClick, closeMenuOnClick, context],
    )

    return (
      <Component
        ref={itemRef}
        role="menuitem"
        className={classes}
        disabled={disabled}
        data-active={active || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

MenuItem.displayName = 'MenuItem'

// ---- MenuSection ----

export const MenuSection = forwardRef<HTMLDivElement, MenuSectionProps>(
  function MenuSection({ title, children, className, ...rest }, ref) {
    const classes = ['eds-menu__section', className].filter(Boolean).join(' ')

    return (
      <div ref={ref} role="group" className={classes} {...rest}>
        {title && (
          <div className="eds-menu__section-title" role="presentation">
            {title}
          </div>
        )}
        {children}
      </div>
    )
  },
)

MenuSection.displayName = 'MenuSection'

// ---- Helper: collect focusable items ----

function collectFocusableIndices(children: ReactNode): number[] {
  const indices: number[] = []
  let index = 0

  function walk(nodes: ReactNode) {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return

      if (child.type === MenuItem) {
        if (!(child.props as MenuItemProps).disabled) {
          indices.push(index)
        }
        index++
      } else if (child.type === MenuSection) {
        walk((child.props as MenuSectionProps).children)
      }
    })
  }

  walk(children)
  return indices
}

function injectIndices(children: ReactNode, focusedIndex: number): ReactNode {
  let index = 0

  function walk(nodes: ReactNode): ReactNode {
    return Children.map(nodes, (child) => {
      if (!isValidElement(child)) return child

      if (child.type === MenuItem) {
        const currentIndex = index++
        return cloneElement(child, {
          'data-menu-index': currentIndex,
          'data-focused': currentIndex === focusedIndex || undefined,
        } as Record<string, unknown>)
      }

      if (child.type === MenuSection) {
        return cloneElement(child, {
          children: walk((child.props as MenuSectionProps).children),
        } as Record<string, unknown>)
      }

      return child
    })
  }

  return walk(children)
}

// ---- Menu ----

const MenuBase = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  {
    anchorEl,
    open = false,
    onClose,
    placement = 'bottom',
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const focusableIndices = useMemo(
    () => collectFocusableIndices(children),
    [children],
  )

  const { x, y, refs, strategy, context, update } = useFloating({
    elements: { reference: anchorEl },
    placement,
    open,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose?.()
    },
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  })

  const { getFloatingProps } = useInteractions([
    useDismiss(context, { escapeKey: false }),
  ])

  // Show/hide popover
  useEffect(() => {
    const el = popoverRef.current
    if (!el) return
    if (open) {
      el.showPopover()
    } else {
      el.hidePopover()
    }
  }, [open])

  // Auto-update position
  useEffect(() => {
    if (anchorEl && popoverRef.current && open) {
      return autoUpdate(anchorEl, popoverRef.current, update)
    }
  }, [anchorEl, open, update])

  // Reset focus when opening
  useEffect(() => {
    if (open) {
      setFocusedIndex(-1)
    }
  }, [open])

  // Focus management
  useEffect(() => {
    if (!open || focusedIndex < 0) return
    const el = menuRef.current?.querySelector<HTMLElement>(
      `[data-menu-index="${focusedIndex}"]`,
    )
    el?.focus()
  }, [open, focusedIndex])

  // Keyboard navigation on anchor
  useEffect(() => {
    if (!anchorEl) return
    const handleKeyDown = (e: Event) => {
      const key = (e as globalThis.KeyboardEvent).key
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault()
        if (!open) {
          anchorEl.click()
        }
        if (key === 'ArrowDown' && focusableIndices.length > 0) {
          setFocusedIndex(focusableIndices[0])
        } else if (key === 'ArrowUp' && focusableIndices.length > 0) {
          setFocusedIndex(focusableIndices[focusableIndices.length - 1])
        }
      }
    }
    anchorEl.addEventListener('keydown', handleKeyDown)
    return () => anchorEl.removeEventListener('keydown', handleKeyDown)
  }, [anchorEl, open, focusableIndices])

  // Keyboard navigation within menu
  const handleMenuKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const { key } = e
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault()
        const currentPos = focusableIndices.indexOf(focusedIndex)
        if (key === 'ArrowDown') {
          const next =
            currentPos < focusableIndices.length - 1
              ? focusableIndices[currentPos + 1]
              : focusableIndices[0]
          setFocusedIndex(next)
        } else {
          const prev =
            currentPos > 0
              ? focusableIndices[currentPos - 1]
              : focusableIndices[focusableIndices.length - 1]
          setFocusedIndex(prev)
        }
      } else if (key === 'Escape') {
        onClose?.()
        anchorEl?.focus()
      } else if (key === 'Tab') {
        onClose?.()
      }
    },
    [focusedIndex, focusableIndices, onClose, anchorEl],
  )

  const contextValue = useMemo<MenuContextValue>(
    () => ({
      onClose,
      focusedIndex,
      setFocusedIndex,
      registerItem: () => {},
      itemCount: focusableIndices.length,
    }),
    [onClose, focusedIndex, focusableIndices.length],
  )

  const classes = ['eds-menu', className].filter(Boolean).join(' ')

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef.current = node
      refs.setFloating(node)
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [refs, ref],
  )

  return (
    <MenuContext.Provider value={contextValue}>
      <div
        ref={mergedRef}
        popover="manual"
        className="eds-menu__popover"
        {...getFloatingProps({
          style: {
            ...style,
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          },
        })}
      >
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus is managed on individual menu items */}
        <div
          ref={menuRef}
          role="menu"
          className={classes}
          onKeyDown={handleMenuKeyDown}
          {...rest}
        >
          {injectIndices(children, focusedIndex)}
        </div>
      </div>
    </MenuContext.Provider>
  )
})

MenuBase.displayName = 'Menu'

// ---- Compound Component ----

type MenuType = typeof MenuBase & {
  Item: typeof MenuItem
  Section: typeof MenuSection
}

export const Menu = MenuBase as MenuType
Menu.Item = MenuItem
Menu.Section = MenuSection
