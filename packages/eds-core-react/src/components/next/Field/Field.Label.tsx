import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import { useFieldContext } from './Field.context'
import type { FieldLabelProps } from './Field.types'
import { classNames } from './field.utils'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel(
    { children, className, showRequiredIndicator = true, ...rest },
    ref,
  ) {
    const { controlId, required, disabled } = useFieldContext()
    const showIndicator = showRequiredIndicator && required

    return (
      <label
        ref={ref}
        className={classNames('eds-field__label', className)}
        htmlFor={rest.htmlFor ?? controlId}
        data-disabled={disabled ? 'true' : undefined}
        {...rest}
      >
        <TypographyNext
          as="span"
          family="ui"
          size="md"
          baseline="center"
          lineHeight="default"
          weight="bolder"
          tracking="normal"
          className="eds-field__label-text"
        >
          {children}
          {showIndicator && (
            <span aria-hidden="true" className="eds-field__required-indicator">
              *
            </span>
          )}
        </TypographyNext>
      </label>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
