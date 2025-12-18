import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { ValidationMessageProps } from './ValidationMessage.types'
import { classNames } from '../Field/field.utils'
import './validation-message.css'

export const ValidationMessage = forwardRef<
  HTMLDivElement,
  ValidationMessageProps
>(function ValidationMessage(
  { tone = 'danger', children, className, role, ...rest },
  ref,
) {
  const resolvedRole = role ?? (tone === 'danger' ? 'alert' : undefined)

  return (
    <div
      ref={ref}
      role={resolvedRole}
      data-field="validation"
      data-horizontal-gap="sm"
      data-color-appearance={tone}
      className={classNames('eds-validation-message', className)}
      {...rest}
    >
      <TypographyNext
        as="span"
        family="ui"
        size="sm"
        baseline="grid"
        lineHeight="default"
        tracking="normal"
        className="eds-validation-message__text"
      >
        {children}
      </TypographyNext>
    </div>
  )
})

ValidationMessage.displayName = 'ValidationMessage'

ValidationMessage.displayName = 'ValidationMessage'
