import React, { forwardRef } from 'react'

type Props = React.HTMLAttributes<HTMLElement>

const ListItem = forwardRef<HTMLLIElement, Props>(function ListItem(
  { children, ...props },
  ref,
) {
  return (
    <li {...props} ref={ref}>
      {children}
    </li>
  )
})

ListItem.displayName = 'eds-listitem'

export { ListItem }
