import * as React from 'react'
import { forwardRef } from 'react'

type Props = {
  background?: string
} & React.HTMLAttributes<HTMLDivElement>

/**
 * This is the Component description
 */

export const OtherComponent = forwardRef<HTMLDivElement, Props>(
  function EdsOtherComponent({ children, background = 'orange' }, ref) {
    return (
      <div style={{ background }} ref={ref}>
        {children}
      </div>
    )
  },
)
