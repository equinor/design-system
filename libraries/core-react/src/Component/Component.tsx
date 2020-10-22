import * as React from 'react'
import { forwardRef, FunctionComponent } from 'react'

export type ComponentProps = {
  /** Some other colour */
  color?: string
} & React.HTMLAttributes<HTMLDivElement>

/**
 * This is the Component description
 */

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  function EdsComponent({ children, color = 'teal' }, ref) {
    return (
      <div style={{ color }} ref={ref}>
        {children}
      </div>
    )
  },
)
