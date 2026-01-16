import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { HelperMessageProps } from './HelperMessage.types'
import './helper-message.css'

/**
 * HelperMessage provides contextual help or validation feedback for form fields.
 *
 * Use with `useFieldIds` hook to connect to form controls via `aria-describedby`.
 *
 * @example
 * ```tsx
 * const { inputId, helperMessageId, getDescribedBy } = useFieldIds()
 *
 * <Field>
 *   <Field.Label htmlFor={inputId}>Email</Field.Label>
 *   <input id={inputId} aria-describedby={getDescribedBy()} />
 *   <HelperMessage id={helperMessageId}>We'll never share your email</HelperMessage>
 * </Field>
 * ```
 */
export const HelperMessage = forwardRef<
  HTMLParagraphElement,
  HelperMessageProps
>(function HelperMessage(
  { disabled = false, children, className, role, id, ...rest },
  ref,
) {
  return (
    <TypographyNext
      ref={ref}
      as="p"
      id={id}
      family="ui"
      size="sm"
      baseline="grid"
      lineHeight="default"
      tracking="normal"
      role={role}
      className={[
        'eds-helper-message',
        disabled && 'eds-helper-message--disabled',
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

HelperMessage.displayName = 'HelperMessage'
