import { forwardRef } from 'react'
import type { MenuItemProps } from './MenuItem.types'

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  function MenuItem({ children, active, ...props }, ref) {
    return (
      <li
        ref={ref}
        className="eds-menu-item"
        data-active={active || undefined}
        {...props}
      >
        {children}
      </li>
    )
  },
)

MenuItem.displayName = 'MenuItem'
