import { forwardRef, useId, useRef, useState, useCallback } from 'react'
import { search as searchIcon } from '@equinor/eds-icons'
import type { AutocompleteProps } from './Autocomplete.types'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Icon } from '../Icon'

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      label,
      description,
      helperMessage,
      id: providedId,
      options = [],
      selectedOption,
      onOptionSelect,
      noOptionsText = 'No options',
      disabled,
      readOnly,
      invalid,
      value,
      defaultValue,
      onChange,
      ...inputProps
    },
    forwardedRef,
  ) {
    const { inputId, descriptionId, helperMessageId, getDescribedBy } =
      useFieldIds(providedId)
    const listboxId = useId()

    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(
      () => defaultValue ?? selectedOption ?? '',
    )
    const inputValue = isControlled ? String(value) : internalValue

    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef],
    )

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase()),
    )
    const showDropdown =
      isOpen && !disabled && !readOnly && filteredOptions.length > 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
      setIsOpen(true)
    }

    const handleFocus = () => setIsOpen(true)

    // Delay close so click on option fires first
    const handleBlur = () => setTimeout(() => setIsOpen(false), 150)

    const handleOptionSelect = (option: string) => {
      if (!isControlled) setInternalValue(option)
      onOptionSelect?.(option)
      setIsOpen(false)
      inputRef.current?.focus()
    }

    // Accent only in interactive states
    const iconTone = disabled || readOnly || invalid ? 'neutral' : 'accent'

    return (
      <div
        className="eds-autocomplete"
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
          <Input
            ref={mergedRef}
            id={inputId}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            disabled={disabled}
            readOnly={readOnly}
            invalid={invalid}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={getDescribedBy({
              hasDescription: !!description,
              hasHelperMessage: !!helperMessage,
            })}
            startAdornment={
              <Icon
                data={searchIcon}
                className="autocomplete-search-icon"
                data-color-appearance={iconTone}
              />
            }
            {...inputProps}
          />
          <ul
            id={listboxId}
            role="listbox"
            className="eds-autocomplete__listbox"
            aria-label={label ? String(label) : undefined}
            hidden={!showDropdown}
          >
            {filteredOptions.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={option === selectedOption}
                className="eds-autocomplete__option"
                onMouseDown={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
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
  },
)

Autocomplete.displayName = 'Autocomplete'
