import { forwardRef } from 'react'
import type { FieldDescriptionProps } from './Field.types'

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ children, className, ...rest }, ref) {
  return (
    <p
      ref={ref}
      className={['eds-field__description', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </p>
  )
})

FieldDescription.displayName = 'Field.Description'
