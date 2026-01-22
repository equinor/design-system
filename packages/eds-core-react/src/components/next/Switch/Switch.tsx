import { forwardRef, useState, useCallback } from 'react'
import { Field, useFieldIds } from '../Field'
import type { SwitchProps } from './Switch.types'

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    disabled,
    className,
    id: providedId,
    checked: controlledChecked,
    defaultChecked,
    onChange,
    ...rest
  },
  ref,
) {
  const { inputId } = useFieldIds(providedId)

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

  // Dev warning for missing accessible name
  if (
    process.env.NODE_ENV !== 'production' &&
    !label &&
    !rest['aria-label'] &&
    !rest['aria-labelledby']
  ) {
    console.warn(
      'Switch: Provide label, aria-label, or aria-labelledby for accessibility',
    )
  }

  // Use accent appearance only when checked and enabled
  const colorAppearance = !disabled && isChecked ? 'accent' : 'neutral'

  const dataAttributes = {
    'data-font-size': 'lg',
    'data-selectable-space': 'md',
    'data-space-proportions': 'squished',
  } as const

  const switchControl = (
    <span
      className="eds-switch__control"
      data-color-appearance={colorAppearance}
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
  )

  // Use Field for layout when label is provided
  if (label) {
    return (
      <Field
        position="start"
        disabled={disabled}
        className={classNames('eds-switch', className)}
        {...dataAttributes}
      >
        {switchControl}
        <Field.Label htmlFor={inputId}>{label}</Field.Label>
      </Field>
    )
  }

  // Standalone switch without label
  return (
    <span
      className={classNames('eds-switch', 'eds-switch--standalone', className)}
      data-disabled={disabled || undefined}
      {...dataAttributes}
    >
      {switchControl}
    </span>
  )
})

Switch.displayName = 'Switch'
