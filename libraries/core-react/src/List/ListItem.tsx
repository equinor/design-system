import { forwardRef } from 'react'
import * as React from 'react'

export type ListItemProps = React.HTMLAttributes<HTMLLIElement>

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { children, ...props },
  ref,
) {
  return (
    <li {...props} ref={ref}>
      {children}
    </li>
  )
})

// ListItem.displayName = 'ListItem'

export { ListItem }
