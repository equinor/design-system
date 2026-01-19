import { forwardRef } from 'react'
import './field.css'
import { FieldDescription } from './Field.Description'
import { HelperMessage } from './Field.HelperMessage'
import type { FieldProps } from './Field.types'
import { FieldLabel } from './Field.Label'

const FieldComponent = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { disabled = false, position, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={['eds-field', className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      data-position={position}
      {...rest}
    >
      {children}
    </div>
  )
})

FieldComponent.displayName = 'Field'

type CompoundField = typeof FieldComponent & {
  Label: typeof FieldLabel
  Description: typeof FieldDescription
  HelperMessage: typeof HelperMessage
}

export const Field = FieldComponent as CompoundField

Field.Label = FieldLabel
Field.Description = FieldDescription
Field.HelperMessage = HelperMessage
