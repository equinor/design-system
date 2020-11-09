import { forwardRef, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

export const PopoverAnchor = forwardRef<HTMLDivElement, Props>(
  function PopoverAnchor({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }
    return <div {...props}>{children}</div>
  },
)

// PopoverAnchor.displayName = 'eds-popover-anchor'
