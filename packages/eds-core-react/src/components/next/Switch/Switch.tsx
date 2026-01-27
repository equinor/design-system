import { forwardRef, useState, useCallback, useId } from 'react'
import { Field } from '../Field'
import type { SwitchProps } from './Switch.types'

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    disabled,
    className,
    id,
    checked: controlledChecked,
    defaultChecked,
    onChange,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  // Track checked state for dynamic color appearance
  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  )
  const isChecked = isControlled ? controlledChecked : internalChecked

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(event.target.checked)
      }
      onChange?.(event)
    },
    [isControlled, onChange],
  )

  return (
    <Field
      position="start"
      disabled={disabled}
      className={['eds-switch', className].filter(Boolean).join(' ')}
      data-font-size="md"
      data-selectable-space="md"
      data-space-proportions="squished"
      data-color-appearance={disabled ? 'neutral' : 'accent'}
    >
      <span
        className="eds-switch__control"
        data-color-appearance={!disabled && isChecked ? 'accent' : 'neutral'}
      >
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          className="eds-switch__input"
          disabled={disabled}
          ref={ref}
          checked={isControlled ? controlledChecked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          onChange={handleChange}
          {...rest}
        />
        <span className="eds-switch__track">
          <span className="eds-switch__handle" />
        </span>
      </span>
      <Field.Label htmlFor={inputId}>{label}</Field.Label>
    </Field>
  )
})

Switch.displayName = 'Switch'
