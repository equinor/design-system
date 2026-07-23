import { forwardRef } from 'react'
import type { FieldLabelProps } from './Field.types'

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ children, className, indicator, ...rest }, ref) {
    return (
      <label
        ref={ref}
        data-baseline="center"
        className={['label', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
        {indicator && <span className="indicator">{indicator}</span>}
      </label>
    )
  },
)

FieldLabel.displayName = 'Field.Label'
