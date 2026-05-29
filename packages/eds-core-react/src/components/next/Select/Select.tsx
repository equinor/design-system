import { forwardRef } from 'react'
import type { SelectProps } from './Select.types'
import { Field, useFieldIds } from '../Field'
import {
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from '../utils/selectOptions'

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
    placeholder,
    className,
    name,
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
        {/*
         * <select> has no native `readonly` attribute — we disable it to prevent
         * interaction. A hidden input preserves the submitted value, which a
         * disabled select would otherwise exclude from FormData.
         */}
        {readOnly && !disabled && name && (
          <input
            type="hidden"
            name={name}
            value={String(selectProps.value ?? selectProps.defaultValue ?? '')}
          />
        )}
        {/* aria-readonly is intentionally absent: setting it on a disabled element
            is contradictory — screen readers would announce both states at once.
            The visual read-only distinction is carried by data-readonly on the container. */}
        <select
          ref={ref}
          id={inputId}
          name={name}
          disabled={disabled || readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={getDescribedBy({
            hasDescription: !!description,
            hasHelperMessage: !!helperMessage,
          })}
          data-space-proportions="squared"
          className={classes}
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
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
