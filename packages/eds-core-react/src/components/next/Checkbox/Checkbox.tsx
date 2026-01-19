/* eslint camelcase: "off" */
import { forwardRef, useEffect, useId, useRef } from 'react'
import {
  checkbox,
  checkbox_outline,
  checkbox_indeterminate,
} from '@equinor/eds-icons'
import { Field } from '../Field'
import { Icon } from '../Icon'
import type { CheckboxProps } from './Checkbox.types'
import './checkbox.css'

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      disabled = false,
      indeterminate = false,
      error = false,
      indicator,
      className,
      id: providedId,
      ...rest
    },
    ref,
  ) {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef
    const generatedId = useId()
    const inputId = providedId ?? generatedId

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, inputRef])

    const checkboxInput = (
      <span className="eds-checkbox__input-wrapper">
        <input
          type="checkbox"
          id={inputId}
          aria-checked={indeterminate ? 'mixed' : rest.checked}
          aria-disabled={disabled || undefined}
          aria-invalid={error || undefined}
          className="eds-checkbox__input"
          disabled={disabled}
          ref={inputRef}
          data-indeterminate={indeterminate}
          {...rest}
        />
        <Icon
          data={checkbox}
          className="eds-checkbox__icon eds-checkbox__icon--checked"
        />
        <Icon
          data={checkbox_outline}
          className="eds-checkbox__icon eds-checkbox__icon--unchecked"
        />
        <Icon
          data={checkbox_indeterminate}
          className="eds-checkbox__icon eds-checkbox__icon--indeterminate"
        />
      </span>
    )

    // Use Field for layout when label is provided
    if (label) {
      return (
        <Field
          position="start"
          disabled={disabled}
          className={classNames('eds-checkbox', className)}
          data-color-appearance={error ? 'danger' : 'accent'}
        >
          {checkboxInput}
          <Field.Label htmlFor={inputId} indicator={indicator}>
            {label}
          </Field.Label>
        </Field>
      )
    }

    // Standalone checkbox without label
    return (
      <span
        className={classNames(
          'eds-checkbox',
          'eds-checkbox--standalone',
          className,
        )}
        data-disabled={disabled || undefined}
        data-color-appearance={error ? 'danger' : 'accent'}
      >
        {checkboxInput}
      </span>
    )
  },
)

Checkbox.displayName = 'Checkbox'
