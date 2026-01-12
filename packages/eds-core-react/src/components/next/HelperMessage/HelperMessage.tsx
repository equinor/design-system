import { forwardRef, useEffect, useRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { HelperMessageProps } from './HelperMessage.types'
import { useOptionalFieldContext } from '../Field/Field.context'
import './helper-message.css'

export const HelperMessage = forwardRef<
  HTMLParagraphElement,
  HelperMessageProps
>(function HelperMessage(
  { disabled, children, className, role, id: providedId, ...rest },
  ref,
) {
  const fieldContext = useOptionalFieldContext()
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      fieldContext?.hasHelperMessage &&
      !hasRegistered.current
    ) {
      console.warn(
        'HelperMessage: Multiple HelperMessage components detected within the same Field. ' +
          'Only one HelperMessage per Field is supported.',
      )
    }
    hasRegistered.current = true
    fieldContext?.setHasHelperMessage(true)
    return () => fieldContext?.setHasHelperMessage(false)
  }, [fieldContext])

  const id = providedId ?? fieldContext?.helperMessageId
  // Inherit disabled from Field context if not explicitly set
  const isDisabled = disabled ?? fieldContext?.disabled ?? false

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
        'eds-helper-message',
        isDisabled && 'eds-helper-message--disabled',
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
