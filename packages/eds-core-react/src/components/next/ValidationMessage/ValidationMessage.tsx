import { forwardRef } from 'react'
import type { ValidationMessageProps } from './ValidationMessage.types'
import { TypographyNext } from '../../Typography'

export const ValidationMessage = forwardRef<
  HTMLParagraphElement,
  ValidationMessageProps
>(function ValidationMessage(
  { children, disabled = false, className, ...rest },
  ref,
) {
  const classes = [
    'eds-validation-message',
    disabled && 'eds-validation-message--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <TypographyNext
      ref={ref}
      as="p"
      className={classes}
      family="ui"
      size="sm"
      lineHeight="default"
      baseline="grid"
      {...rest}
    >
      {children}
    </TypographyNext>
  )
})
