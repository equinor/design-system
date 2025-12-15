import { forwardRef, useEffect, useId } from 'react'
import { TypographyNext } from '../../Typography'
import type { ValidationMessageProps } from './ValidationMessage.types'
import { useOptionalFieldContext } from '../Field/Field.context'

const classNames = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const ValidationMessage = forwardRef<
  HTMLDivElement,
  ValidationMessageProps
>(function ValidationMessage(
  { tone = 'danger', children, className, role, id, ...rest },
  ref,
) {
  const fieldContext = useOptionalFieldContext()
  const resolvedRole = role ?? (tone === 'danger' ? 'alert' : undefined)
  const generatedId = useId()
  const resolvedId = id ?? `${generatedId}-validation`

  useEffect(() => {
    if (!fieldContext) {
      return undefined
    }

    fieldContext.registerValidation(resolvedId, tone)

    return () => fieldContext.unregisterValidation(resolvedId)
  }, [fieldContext, resolvedId, tone])

  const combinedClassName = classNames(
    'eds-validation-message',
    fieldContext ? 'eds-field__validation' : undefined,
    className,
  )

  return (
    <div
      ref={ref}
      role={resolvedRole}
      id={resolvedId}
      className={combinedClassName}
      data-horizontal-gap="sm"
      data-color-appearance={tone}
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
