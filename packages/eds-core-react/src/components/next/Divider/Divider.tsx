import { forwardRef } from 'react'
import type { DividerProps } from './Divider.types'

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { className, ...rest },
  ref,
) {
  const classes = ['eds-divider', className].filter(Boolean).join(' ')
  return <hr ref={ref} className={classes} {...rest} />
})

Divider.displayName = 'Divider'
