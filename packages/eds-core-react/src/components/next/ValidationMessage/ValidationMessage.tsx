import { forwardRef, useEffect } from 'react'
import { TypographyNext } from '../../Typography'
import type { ValidationMessageProps } from './ValidationMessage.types'
import { useOptionalFieldContext } from '../Field/Field.context'
import './validation-message.css'

export const ValidationMessage = forwardRef<
  HTMLParagraphElement,
  ValidationMessageProps
>(function ValidationMessage(
  { disabled = false, children, className, role, id: providedId, ...rest },
  ref,
) {
  const fieldContext = useOptionalFieldContext()

  useEffect(() => {
    fieldContext?.setHasValidation(true)
    return () => fieldContext?.setHasValidation(false)
  }, [fieldContext])

  const id = providedId ?? fieldContext?.validationId

  return (
    <TypographyNext
      ref={ref}
      as="p"
      id={id}
      family="ui"
      size="md"
      baseline="grid"
      lineHeight="default"
      tracking="normal"
      role={role}
      className={[
        'eds-validation-message',
        disabled && 'eds-validation-message--disabled',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

ValidationMessage.displayName = 'ValidationMessage'
