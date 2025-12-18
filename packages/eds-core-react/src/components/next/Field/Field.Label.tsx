import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { FieldLabelProps } from './Field.types'
import { classNames } from './field.utils'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ children, className, indicator, ...rest }, ref) {
    return (
      <label
        ref={ref}
        className={classNames('eds-field__label', className)}
        data-field="label"
        {...rest}
      >
        <TypographyNext
          as="span"
          family="ui"
          size="lg"
          baseline="center"
          lineHeight="default"
          weight="normal"
          tracking="normal"
        >
          {children}
        </TypographyNext>
        {indicator && (
          <TypographyNext
            as="span"
            family="ui"
            size="md"
            baseline="center"
            lineHeight="default"
            weight="normal"
            tracking="normal"
            className="eds-field__indicator"
          >
            {indicator}
          </TypographyNext>
        )}
      </label>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
