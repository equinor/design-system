import { forwardRef } from 'react'
import type { LabelProps } from './Label.types'
import { TypographyNext } from '../../Typography'

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { label, optional = false, required = false, className, ...rest },
  ref,
) {
  const classes = ['eds-label', className].filter(Boolean).join(' ')

  // Determine which indicator to show (required takes precedence if both are set)
  const indicator = required ? '(Required)' : optional ? '(Optional)' : null

  return (
    <TypographyNext
      ref={ref}
      as="label"
      className={classes}
      family="ui"
      size="lg"
      lineHeight="squished"
      baseline="center"
      {...rest}
    >
      {label}
      {indicator && (
        <span className="eds-label__indicator" data-font-size="sm">
          {indicator}
        </span>
      )}
    </TypographyNext>
  )
})
