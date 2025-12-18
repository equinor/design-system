import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { ValidationMessageProps } from './ValidationMessage.types'
import { classNames } from '../Field/field.utils'
import './validation-message.css'

export const ValidationMessage = forwardRef<
  HTMLParagraphElement,
  ValidationMessageProps
>(function ValidationMessage(
  { disabled = false, children, className, role, ...rest },
  ref,
) {
  return (
    <TypographyNext
      ref={ref}
      as="p"
      family="ui"
      size="md"
      baseline="grid"
      lineHeight="default"
      tracking="normal"
      role={role}
      data-field="validation"
      className={classNames(
        'eds-validation-message',
        disabled && 'eds-validation-message--disabled',
        className,
      )}
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})

ValidationMessage.displayName = 'ValidationMessage'
