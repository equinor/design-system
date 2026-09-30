import { forwardRef } from 'react'
import type { HelperMessageProps } from './Field.HelperMessage.types'

/**
 * Field.HelperMessage provides contextual help or validation feedback for form fields.
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
 *   <Field.HelperMessage id={helperMessageId}>We'll never share your email</Field.HelperMessage>
 * </Field>
 * ```
 */
export const HelperMessage = forwardRef<
  HTMLParagraphElement,
  HelperMessageProps
>(function HelperMessage({ children, className, role, id, ...rest }, ref) {
  return (
    <p
      ref={ref}
      data-baseline="grid"
      id={id}
      role={role}
      className={['helper-message', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </p>
  )
})

HelperMessage.displayName = 'Field.HelperMessage'
