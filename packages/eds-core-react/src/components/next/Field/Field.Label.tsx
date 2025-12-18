import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldLabelProps } from './Field.types'
import { classNames } from './field.utils'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ children, className, indicator, ...rest }, ref) {
    return (
      <TypographyNext
        ref={ref}
        as="label"
        family="ui"
        size="lg"
        baseline="center"
        lineHeight="default"
        weight="normal"
        tracking="normal"
        data-field="label"
        className={classNames('eds-field__label', className)}
        {...rest}
      >
        {children}
        {indicator && <span className="eds-field__indicator">{indicator}</span>}
      </TypographyNext>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
