import { forwardRef } from 'react'
import type { FieldLabelProps } from './Field.types'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ children, className, indicator, ...rest }, ref) {
    return (
      <label
        ref={ref}
        className={['eds-field__label', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
        {indicator && <span className="eds-field__indicator">{indicator}</span>}
      </label>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
