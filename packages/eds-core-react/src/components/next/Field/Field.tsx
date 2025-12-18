import { forwardRef } from 'react'
import type { FieldProps } from './Field.types'
import { FieldDescription } from './FieldDescription'
import './field.css'

const FieldBase = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { children, className, ...rest },
  ref,
) {
  const classes = ['eds-field', className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  )
})

export const Field = Object.assign(FieldBase, {
  Description: FieldDescription,
})
