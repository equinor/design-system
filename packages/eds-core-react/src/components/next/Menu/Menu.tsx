import { forwardRef } from 'react'
import type { MenuProps } from './Menu.types'

export const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { children, ...props },
  ref,
) {
  return (
    <ul ref={ref} className="eds-menu" {...props}>
      {children}
    </ul>
  )
})

Menu.displayName = 'Menu'
