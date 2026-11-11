import { forwardRef, useId } from 'react'
import { Field } from '../Field'
import type { SwitchProps } from './Switch.types'

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, disabled, className, style, id, ...rest },
  ref,
) {
  const generatedId = useId()
  // `||`, not `??`: an empty string is treated as no id
  const inputId = id || generatedId

  return (
    <Field
      position="start"
      disabled={disabled}
      className={['eds-switch', className].filter(Boolean).join(' ')}
      style={style}
      data-tone="accent"
    >
      <span className="control">
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          className="input"
          disabled={disabled}
          ref={ref}
          {...rest}
        />
        <span className="track">
          <span className="handle" />
        </span>
      </span>
      <Field.Label htmlFor={inputId}>{label}</Field.Label>
    </Field>
  )
})

Switch.displayName = 'Switch'
