import { forwardRef, useId, useState, useMemo } from 'react'
import './field.css'
import { FieldDescription } from './Field.Description'
import { FieldControl } from './Field.Control'
import type { FieldProps } from './Field.types'
import { FieldLabel } from './Field.Label'
import { FieldContext, type FieldContextValue } from './Field.context'

const FieldComponent = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    required = false,
    disabled = false,
    position,
    className,
    children,
    ...rest
  },
  ref,
) {
  const id = useId()
  const [hasDescription, setHasDescription] = useState(false)
  const [hasValidation, setHasValidation] = useState(false)

  const contextValue = useMemo<FieldContextValue>(
    () => ({
      id,
      labelId: `${id}-label`,
      descriptionId: `${id}-description`,
      validationId: `${id}-validation`,
      required,
      disabled,
      hasDescription,
      hasValidation,
      setHasDescription,
      setHasValidation,
    }),
    [id, required, disabled, hasDescription, hasValidation],
  )

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={['eds-field', className].filter(Boolean).join(' ')}
        data-required={required || undefined}
        data-disabled={disabled || undefined}
        data-position={position}
        {...rest}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
})

FieldComponent.displayName = 'Field'

type CompoundField = typeof FieldComponent & {
  Label: typeof FieldLabel
  Description: typeof FieldDescription
  Control: typeof FieldControl
}

export const Field = FieldComponent as CompoundField

Field.Label = FieldLabel
Field.Description = FieldDescription
Field.Control = FieldControl
