import { forwardRef, useRef } from 'react'
import { Field, useFieldIds } from '../Field'
import type { SwitchProps } from './Switch.types'
import './switch.css'

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
    ...rest
  },
  ref,
) {
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef
  const ids = useFieldIds(providedId)

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
        ref={inputRef}
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
        <span className="eds-switch__control" data-color-appearance="accent">
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
      <span className="eds-switch__control" data-color-appearance="accent">
        {switchInput}
      </span>
    </span>
  )
})

Switch.displayName = 'Switch'
