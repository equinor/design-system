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

  const control = (
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
  )

  const rootClassName = ['eds-switch', className].filter(Boolean).join(' ')

  if (label) {
    return (
      <Field
        position="start"
        disabled={disabled}
        className={rootClassName}
        style={style}
        data-tone="accent"
      >
        {control}
        <Field.Label htmlFor={inputId}>{label}</Field.Label>
      </Field>
    )
  }

  return (
    <span
      className={rootClassName}
      style={style}
      data-standalone={true}
      data-tone="accent"
    >
      {control}
    </span>
  )
})

Switch.displayName = 'Switch'
