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
      indicator,
      helperMessage,
      id: providedId,
      ...rest
    },
    ref,
  ) {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef
    const generatedId = useId()
    const inputId = providedId ?? generatedId
    const helperMessageId = `${inputId}-helper`

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, inputRef])

    const checkboxInput = (
      <>
        <input
          type="checkbox"
          id={inputId}
          aria-checked={indeterminate ? 'mixed' : undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={helperMessage ? helperMessageId : undefined}
          className="eds-checkbox__input"
          disabled={disabled}
          ref={inputRef}
          data-indeterminate={indeterminate}
          {...rest}
        />
        <span className="eds-checkbox__icon-wrapper">
          <Icon
            data={checkbox}
            size="lg"
            className="eds-checkbox__icon eds-checkbox__icon--checked"
          />
          <Icon
            data={checkbox_outline}
            size="lg"
            className="eds-checkbox__icon eds-checkbox__icon--unchecked"
          />
          <Icon
            data={checkbox_indeterminate}
            size="lg"
            className="eds-checkbox__icon eds-checkbox__icon--indeterminate"
          />
        </span>
      </>
    )

    // Use Field for layout when label is provided
    if (label) {
      return (
        <Field
          position="start"
          disabled={disabled}
          className="eds-checkbox"
          data-color-appearance="accent"
          data-selectable-space="md"
          data-space-proportions="squished"
        >
          {checkboxInput}
          <Field.Label htmlFor={inputId} indicator={indicator}>
            {label}
          </Field.Label>
          {helperMessage && (
            <Field.HelperMessage id={helperMessageId}>
              {helperMessage}
            </Field.HelperMessage>
          )}
        </Field>
      )
    }

    return (
      <span
        className={classNames('eds-checkbox', 'eds-checkbox--standalone')}
        data-color-appearance="accent"
        data-disabled={disabled || undefined}
      >
        {checkboxInput}
      </span>
    )
  },
)

Checkbox.displayName = 'Checkbox'
