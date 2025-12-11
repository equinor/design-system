import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import { useFieldContext } from './Field.context'
import type { FieldLabelProps } from './Field.types'
import { classNames } from './field.utils'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel(
    {
      children,
      className,
      showRequiredIndicator = true,
      showOptionalIndicator = false,
      ...rest
    },
    ref,
  ) {
    const { controlId, required, disabled } = useFieldContext()
    const showRequired = showRequiredIndicator && required
    const showOptional = showOptionalIndicator && !required

    return (
      <label
        ref={ref}
        className={classNames('eds-field__label', className)}
        htmlFor={rest.htmlFor ?? controlId}
        data-disabled={disabled ? 'true' : undefined}
        {...rest}
      >
        <span className="eds-field__label-content">
          <TypographyNext
            as="span"
            family="ui"
            size="md"
            baseline="center"
            lineHeight="default"
            weight="normal"
            tracking="normal"
            className="eds-field__label-text"
          >
            {children}
          </TypographyNext>
          {showRequired && (
            <span aria-hidden="true" className="eds-field__required-indicator">
              *
            </span>
          )}
          {showOptional && (
            <TypographyNext
              as="span"
              family="ui"
              size="sm"
              baseline="center"
              lineHeight="default"
              weight="normal"
              tracking="normal"
              className="eds-field__optional-indicator"
            >
              (Optional)
            </TypographyNext>
          )}
        </span>
      </label>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
