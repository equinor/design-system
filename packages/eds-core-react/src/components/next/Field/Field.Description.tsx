import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldDescriptionProps } from './Field.types'
import { classNames } from './field.utils'

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ children, className, ...rest }, ref) {
  return (
    <TypographyNext
      ref={ref}
      as="p"
      family="ui"
      size="sm"
      baseline="center"
      lineHeight="default"
      tracking="normal"
      data-field="description"
      className={classNames('eds-field__description', className)}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

FieldDescription.displayName = 'Field.Description'
