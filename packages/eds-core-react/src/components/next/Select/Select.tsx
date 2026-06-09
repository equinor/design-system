import { forwardRef } from 'react'
import { arrow_drop_down, error_filled } from '@equinor/eds-icons'
import type { SelectOptionGroup, SelectProps } from './Select.types'
import { Field, useFieldIds } from '../Field'
import { Icon } from '../Icon'
import {
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from '../utils/selectOptions'

function isOptionGroup<T>(
  item: T | SelectOptionGroup<T>,
): item is SelectOptionGroup<T> {
  return (
    typeof item === 'object' &&
    item !== null &&
    'options' in (item as object) &&
    'label' in (item as object)
  )
}

function renderOption<T>(
  option: T,
  getOptionLabel?: (option: T) => string,
  getOptionValue?: (option: T) => string,
  optionDisabled?: (option: T) => boolean,
) {
  const label = resolveOptionLabel(option, getOptionLabel)
  const key = resolveOptionKey(option, getOptionValue, getOptionLabel)
  const value = getOptionValue ? getOptionValue(option) : label
  const disabled = isOptionDisabled(option, optionDisabled)
  return (
    <option key={key} value={value} disabled={disabled}>
      {label}
    </option>
  )
}

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

  const { onChange: handleChange, ...restSelectProps } = selectProps

  const displayErrorIcon = invalid && !disabled && !readOnly

  return (
    <Field disabled={disabled}>
      {label && (
        <Field.Label htmlFor={inputId} indicator={indicator}>
          {label}
        </Field.Label>
      )}
      {description && (
        <Field.Description id={descriptionId}>{description}</Field.Description>
      )}
      {/* No native readonly — pointer-events blocked via CSS, keys via onKeyDown, value via hidden input */}
      {readOnly && !disabled && name && (
        <input
          type="hidden"
          name={name}
          value={String(selectProps.value ?? selectProps.defaultValue ?? '')}
        />
      )}
      <div
        className={['eds-select', className].filter(Boolean).join(' ')}
        data-color-appearance={
          invalid && !disabled && !readOnly ? 'danger' : 'neutral'
        }
      >
        {displayErrorIcon && (
          <span aria-hidden="true" className="error-icon" data-font-size="xs">
            <Icon data={error_filled} />
          </span>
        )}
        <span
          aria-hidden="true"
          className="chevron"
          data-color-appearance={invalid && !disabled ? 'neutral' : 'accent'}
        >
          <Icon data={arrow_drop_down} />
        </span>
        <select
          ref={ref}
          id={inputId}
          name={readOnly ? undefined : name}
          disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          aria-invalid={invalid || undefined}
          data-readonly={readOnly || undefined}
          onChange={
            readOnly && !disabled ? (handleChange ?? (() => {})) : handleChange
          }
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
          defaultValue={
            placeholder &&
            restSelectProps.value === undefined &&
            restSelectProps.defaultValue === undefined
              ? ''
              : undefined
          }
          {...restSelectProps}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((item) =>
            isOptionGroup(item) ? (
              <optgroup key={item.label} label={item.label}>
                {item.options.map((opt) =>
                  renderOption(
                    opt,
                    getOptionLabel,
                    getOptionValue,
                    optionDisabled,
                  ),
                )}
              </optgroup>
            ) : (
              renderOption(item, getOptionLabel, getOptionValue, optionDisabled)
            ),
          )}
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
  )
}

;(SelectInner as unknown as { displayName?: string }).displayName = 'Select'

export const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> },
) => React.ReactElement | null
