import { forwardRef, useEffect } from 'react'
import { TypographyNext } from '../../Typography'
import type { HelperMessageProps } from './HelperMessage.types'
import { useOptionalFieldContext } from '../Field/Field.context'
import './helper-message.css'

export const HelperMessage = forwardRef<
  HTMLParagraphElement,
  HelperMessageProps
>(function HelperMessage(
  { disabled = false, children, className, role, id: providedId, ...rest },
  ref,
) {
  const fieldContext = useOptionalFieldContext()

  useEffect(() => {
    fieldContext?.setHasHelperMessage(true)
    return () => fieldContext?.setHasHelperMessage(false)
  }, [fieldContext])

  const id = providedId ?? fieldContext?.helperMessageId

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
