import { forwardRef, useEffect, useRef } from 'react'
import './field.css'
import { FieldDescription } from './Field.Description'
import type { FieldProps } from './Field.types'
import { FieldLabel } from './Field.Label'
import { classNames } from './field.utils'
import { fieldObserver } from './field-observer'

const FieldComponent = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { required = false, disabled = false, className, children, ...rest },
  ref,
) {
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => fieldObserver(fieldRef.current), [])

  // Merge refs
  const setRefs = (node: HTMLDivElement | null) => {
    fieldRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <div
      ref={setRefs}
      className={classNames('eds-field', className)}
      data-required={required || undefined}
      data-disabled={disabled || undefined}
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
}

export const Field = FieldComponent as CompoundField

Field.Label = FieldLabel
Field.Description = FieldDescription
