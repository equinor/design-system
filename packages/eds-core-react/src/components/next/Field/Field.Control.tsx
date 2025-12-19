import { forwardRef, cloneElement, isValidElement } from 'react'
import type { FieldControlProps } from './Field.types'
import { useFieldContext } from './Field.context'

export const FieldControl = forwardRef<HTMLDivElement, FieldControlProps>(
  function FieldControl({ children, className, ...rest }, ref) {
    const {
      id,
      descriptionId,
      validationId,
      required,
      disabled,
      hasDescription,
      hasValidation,
    } = useFieldContext()

    // Build aria-describedby from present elements
    const describedBy = [
      hasValidation && validationId,
      hasDescription && descriptionId,
    ]
      .filter(Boolean)
      .join(' ')

    // Clone the child element and add accessibility props
    const enhancedChild = isValidElement<Record<string, unknown>>(children)
      ? cloneElement(children, {
          ...children.props,
          id,
          'aria-describedby': describedBy || undefined,
          'aria-required': required || undefined,
          disabled: disabled || undefined,
        })
      : children

    return (
      <div
        ref={ref}
        className={['eds-field__control', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {enhancedChild}
      </div>
    )
  },
)

FieldControl.displayName = 'Field.Control'
