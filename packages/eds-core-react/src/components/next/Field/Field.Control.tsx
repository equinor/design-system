import { forwardRef, cloneElement, isValidElement } from 'react'
import type { FieldControlProps, InjectedControlProps } from './Field.types'
import { useFieldContext } from './Field.context'

export const FieldControl = forwardRef<HTMLDivElement, FieldControlProps>(
  function FieldControl({ children, className, ...rest }, ref) {
    const {
      id,
      descriptionId,
      helperMessageId,
      required,
      disabled,
      hasDescription,
      hasHelperMessage,
    } = useFieldContext()

    // Build aria-describedby from present elements
    const describedBy = [
      hasHelperMessage && helperMessageId,
      hasDescription && descriptionId,
    ]
      .filter(Boolean)
      .join(' ')

    // Clone the child element and add accessibility props
    // Uses intersection with Record<string, unknown> to allow any additional
    // props the child element may have beyond InjectedControlProps
    const enhancedChild = isValidElement<
      InjectedControlProps & Record<string, unknown>
    >(children)
      ? cloneElement(children, {
          ...children.props,
          id: children.props.id ?? id,
          'aria-describedby':
            [describedBy, children.props['aria-describedby']]
              .filter(Boolean)
              .join(' ') || undefined,
          'aria-required':
            children.props['aria-required'] ?? required ?? undefined,
          disabled: children.props.disabled ?? disabled ?? undefined,
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
