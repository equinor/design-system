import { forwardRef, useState, useCallback } from 'react'
import { Field, useFieldIds } from '../Field'
import type { SwitchProps } from './Switch.types'

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    disabled = false,
    indicator,
    helperMessage,
    className,
    id: providedId,
    checked: controlledChecked,
    defaultChecked,
    onChange,
    ...rest
  },
  ref,
) {
  const ids = useFieldIds(providedId)

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

  // Use accent appearance only when checked and enabled
  const colorAppearance = !disabled && isChecked ? 'accent' : 'neutral'

  // When no visible label is provided, use aria-label for accessibility
  const switchInput = (
    <>
      <input
        type="checkbox"
        role="switch"
        id={ids.inputId}
        aria-disabled={disabled || undefined}
        aria-describedby={ids.getDescribedBy({
          hasDescription: false,
          hasHelperMessage: !!helperMessage,
        })}
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
    </>
  )

  // Use Field for layout when label is provided
  if (label) {
    return (
      <Field
        position="start"
        disabled={disabled}
        className={classNames('eds-switch', className)}
      >
        <span
          className="eds-switch__control"
          data-color-appearance={colorAppearance}
        >
          {switchInput}
        </span>
        <Field.Label htmlFor={ids.inputId} indicator={indicator}>
          {label}
        </Field.Label>
        {helperMessage && (
          <Field.HelperMessage id={ids.helperMessageId}>
            {helperMessage}
          </Field.HelperMessage>
        )}
      </Field>
    )
  }

  // Standalone switch without label
  return (
    <span
      className={classNames('eds-switch', 'eds-switch--standalone', className)}
      data-disabled={disabled || undefined}
    >
      <span
        className="eds-switch__control"
        data-color-appearance={colorAppearance}
      >
        {switchInput}
      </span>
    </span>
  )
})

Switch.displayName = 'Switch'
