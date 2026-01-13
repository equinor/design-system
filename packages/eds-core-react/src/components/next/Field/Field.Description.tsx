import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldDescriptionProps } from './Field.types'

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ children, className, ...rest }, ref) {
  return (
    <TypographyNext
      ref={ref}
      as="p"
      family="ui"
      size="md"
      baseline="center"
      lineHeight="default"
      tracking="normal"
      className={['eds-field__description', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

FieldDescription.displayName = 'Field.Description'
