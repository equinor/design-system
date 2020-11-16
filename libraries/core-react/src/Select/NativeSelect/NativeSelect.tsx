import * as React from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'

export type NativeSelectProps = {
  /** Label for the select element */
  label: string
} & SelectHTMLAttributes<HTMLSelectElement>

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ label, children }, ref) {
    return (
      <label>
        {label}
        <select ref={ref}>{children}</select>
      </label>
    )
  },
)
