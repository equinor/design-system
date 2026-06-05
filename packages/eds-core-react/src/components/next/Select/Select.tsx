import { forwardRef } from 'react'
import { arrow_drop_down, error_filled } from '@equinor/eds-icons'
import type { SelectProps } from './Select.types'
import { Field, useFieldIds } from '../Field'
import { Icon } from '../Icon'
import {
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from '../utils/selectOptions'

function SelectInner<T = string>(
  {
    label,
    indicator,
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
  const displayErrorIcon = invalid && !disabled && !readOnly

  return (
    <div
      className="eds-select-container"
      data-color-appearance={invalid ? 'danger' : undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={invalid || undefined}
    >
      <Field disabled={disabled}>
        {label && (
          <Field.Label htmlFor={inputId} indicator={indicator}>
            {label}
          </Field.Label>
        )}
        {description && (
          <Field.Description id={descriptionId}>
            {description}
          </Field.Description>
        )}
        {/*
         * <select> has no native `readonly` attribute. Mouse interaction is blocked
         * via CSS pointer-events:none; keyboard changes are suppressed via onKeyDown.
         * A hidden input carries the submitted value since the select has no name
         * when readOnly (preventing it from contributing to FormData itself).
         */}
        {readOnly && !disabled && name && (
          <input
            type="hidden"
            name={name}
            value={String(selectProps.value ?? selectProps.defaultValue ?? '')}
          />
        )}
        <div className="eds-select-wrapper">
          {displayErrorIcon && (
            <span aria-hidden="true" className="error-icon" data-font-size="xs">
              <Icon data={error_filled} />
            </span>
          )}
          <span aria-hidden="true" className="chevron">
            <Icon data={arrow_drop_down} />
          </span>
          <select
            ref={ref}
            id={inputId}
            name={readOnly ? undefined : name}
            disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            aria-invalid={invalid || undefined}
            onKeyDown={
              readOnly && !disabled
                ? (e) => {
                    if (!['Tab', 'Shift'].includes(e.key)) e.preventDefault()
                  }
                : undefined
            }
            aria-describedby={getDescribedBy({
              hasDescription: !!description,
              hasHelperMessage: !!helperMessage,
            })}
            data-space-proportions="squared"
            data-color-appearance="neutral"
            className={classes}
            defaultValue={
              placeholder &&
              selectProps.value === undefined &&
              selectProps.defaultValue === undefined
                ? ''
                : undefined
            }
            {...selectProps}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => {
              const optionLabel = resolveOptionLabel(option, getOptionLabel)
              const key = resolveOptionKey(
                option,
                getOptionValue,
                getOptionLabel,
              )
              const value = getOptionValue
                ? getOptionValue(option)
                : optionLabel
              const isDisabled = isOptionDisabled(option, optionDisabled)
              return (
                <option key={key} value={value} disabled={isDisabled}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
        </div>
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

;(SelectInner as unknown as { displayName?: string }).displayName = 'Select'

export const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> },
) => React.ReactElement | null
