import { forwardRef } from 'react'
import type { SelectProps } from './Select.types'
import { Field, useFieldIds } from '../Field'
import {
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from '../utils/selectOptions'
import './select.css'

function SelectInner<T = string>(
  {
    label,
    description,
    helperMessage,
    id: providedId,
    options = [],
    getOptionLabel,
    getOptionValue,
    optionDisabled,
    disabled,
    readOnly,
    invalid,
    className,
    ...selectProps
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLSelectElement>,
) {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds(providedId)

  const classes = ['eds-select', className].filter(Boolean).join(' ')

  return (
    <div
      className="eds-select-container"
      data-color-appearance={invalid ? 'danger' : undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={invalid || undefined}
    >
      <Field disabled={disabled}>
        {label && <Field.Label htmlFor={inputId}>{label}</Field.Label>}
        {description && (
          <Field.Description id={descriptionId}>
            {description}
          </Field.Description>
        )}
        <select
          ref={ref}
          id={inputId}
          disabled={disabled || readOnly}
          aria-readonly={readOnly || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={getDescribedBy({
            hasDescription: !!description,
            hasHelperMessage: !!helperMessage,
          })}
          className={classes}
          {...selectProps}
        >
          {options.map((option) => {
            const label = resolveOptionLabel(option, getOptionLabel)
            const key = resolveOptionKey(option, getOptionValue, getOptionLabel)
            const value = getOptionValue ? getOptionValue(option) : label
            const disabled = isOptionDisabled(option, optionDisabled)
            return (
              <option key={key} value={value} disabled={disabled}>
                {label}
              </option>
            )
          })}
        </select>
        {helperMessage && (
          <Field.HelperMessage
            id={helperMessageId}
            role={invalid ? 'alert' : undefined}
          >
            {helperMessage}
          </Field.HelperMessage>
        )}
      </Field>
    </div>
  )
}

export const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> },
) => React.ReactElement | null
;(Select as React.FC).displayName = 'Select'
