import { forwardRef } from 'react'
import type { NativeSelectProps } from './NativeSelect.types'
import { Field, useFieldIds } from '../Field'
import {
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from '../utils/selectOptions'
import './nativeselect.css'

function NativeSelectInner<T = string>(
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
  }: NativeSelectProps<T>,
  ref: React.ForwardedRef<HTMLSelectElement>,
) {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds(providedId)

  const classes = ['eds-native-select', className].filter(Boolean).join(' ')

  return (
    <div
      className="eds-native-select-container"
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

export const NativeSelect = forwardRef(NativeSelectInner) as <T = string>(
  props: NativeSelectProps<T> & { ref?: React.Ref<HTMLSelectElement> },
) => React.ReactElement | null
;(NativeSelect as React.FC).displayName = 'NativeSelect'
