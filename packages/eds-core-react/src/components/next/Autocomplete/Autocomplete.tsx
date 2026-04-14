import {
  forwardRef,
  useId,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from 'react'
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
      noOptionsText: _noOptionsText = 'No options',
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
    const uid = useId()
    const listboxId = `eds-autocomplete-listbox-${uid.replace(/:/g, '')}`
    const anchorName = `--eds-autocomplete-${uid.replace(/:/g, '')}`

    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(
      () => defaultValue ?? selectedOption ?? '',
    )
    const inputValue = isControlled ? String(value) : internalValue

    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const listboxRef = useRef<HTMLUListElement | null>(null)

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
    const canOpen = !disabled && !readOnly && filteredOptions.length > 0

    const openListbox = () => {
      if (canOpen && !listboxRef.current?.matches(':popover-open')) {
        listboxRef.current?.showPopover()
      }
    }

    const closeListbox = () => {
      if (listboxRef.current?.matches(':popover-open')) {
        listboxRef.current.hidePopover()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
      // Re-evaluate canOpen after state update — open if there are matches
      if (!disabled && !readOnly) {
        listboxRef.current?.showPopover()
      }
    }

    const handleFocus = () => openListbox()

    const handleOptionSelect = (option: string) => {
      if (!isControlled) setInternalValue(option)
      onOptionSelect?.(option)
      closeListbox()
      inputRef.current?.focus()
    }

    // Sync aria-expanded from the popover toggle event (covers light-dismiss too)
    const handleToggle = (e: React.SyntheticEvent<HTMLUListElement>) => {
      const toggleEvent = e.nativeEvent as ToggleEvent
      setIsOpen(toggleEvent.newState === 'open')
    }

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
          <div
            className="eds-autocomplete__anchor"
            style={{ '--autocomplete-anchor': anchorName } as CSSProperties}
          >
            <Input
              ref={mergedRef}
              id={inputId}
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-haspopup="listbox"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
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
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              // auto: top-layer + light-dismiss (click outside closes)
              popover="auto"
              className="eds-autocomplete__listbox"
              aria-label={typeof label === 'string' ? label : undefined}
              onToggle={handleToggle}
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
  },
)

Autocomplete.displayName = 'Autocomplete'
