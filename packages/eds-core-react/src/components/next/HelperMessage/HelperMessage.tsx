import { forwardRef } from 'react'
import type { HelperMessageProps } from './HelperMessage.types'
import { TypographyNext } from '../../Typography'

export const HelperMessage = forwardRef<
  HTMLParagraphElement,
  HelperMessageProps
>(function HelperMessage(
  { children, disabled = false, className, ...rest },
  ref,
) {
  const classes = [
    'eds-helper-message',
    disabled && 'eds-helper-message--disabled',
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
