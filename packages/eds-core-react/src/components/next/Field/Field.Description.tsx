import { forwardRef, useEffect, useId } from 'react'
import { TypographyNext } from '../../Typography'
import { useFieldContext } from './Field.context'
import type { FieldDescriptionProps } from './Field.types'
import { classNames } from './field.utils'

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ id, children, className, ...rest }, ref) {
  const { registerDescription, unregisterDescription } = useFieldContext()
  const generatedId = useId()
  const resolvedId = id ?? `${generatedId}-description`

  useEffect(() => {
    registerDescription(resolvedId)
    return () => unregisterDescription(resolvedId)
  }, [registerDescription, unregisterDescription, resolvedId])

  return (
    <TypographyNext
      ref={ref}
      as="p"
      id={resolvedId}
      family="ui"
      size="sm"
      baseline="center"
      lineHeight="default"
      tracking="normal"
      className={classNames('eds-field__description', className)}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

FieldDescription.displayName = 'Field.Description'
