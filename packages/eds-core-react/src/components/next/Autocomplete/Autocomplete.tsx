import {
  forwardRef,
  useId,
  useRef,
  useState,
  useCallback,
  useEffect,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { search as searchIcon, close } from '@equinor/eds-icons'
import type { AutocompleteProps } from './Autocomplete.types'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Icon } from '../Icon'
import { Button } from '../Button'
import { Menu, MenuItem } from '../Menu'

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
      allowCustomValue,
      onClear,
      clearLabel = 'Clear',
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
    const [activeIndex, setActiveIndex] = useState(-1)
    const [isFiltering, setIsFiltering] = useState(false)
    const isMouseInteraction = useRef(false)
    const [internalSelectedOption, setInternalSelectedOption] = useState(
      () => selectedOption,
    )
    const effectiveSelected = selectedOption ?? internalSelectedOption
    const [announcement, setAnnouncement] = useState('')
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

    const filteredOptions = isFiltering
      ? options.filter((option) =>
          option.toLowerCase().includes(inputValue.toLowerCase()),
        )
      : options

    const canAddCustomValue =
      allowCustomValue &&
      isFiltering &&
      inputValue.trim() !== '' &&
      !filteredOptions.some(
        (o) => o.toLowerCase() === inputValue.trim().toLowerCase(),
      )

    const addOptionIndex = filteredOptions.length
    const totalOptions = filteredOptions.length + (canAddCustomValue ? 1 : 0)

    const canOpen = !disabled && !readOnly

    const getOptionId = (index: number) => `${listboxId}-option-${index}`

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
      setIsFiltering(true)
      setActiveIndex(-1)
      if (canOpen) listboxRef.current?.showPopover()
    }

    // onFocus handles Tab-into-field; mouse clicks are handled by onClick
    // to avoid the Popover API light-dismissing the popover in the same
    // pointerdown tick that triggered focus
    const handleFocus = () => {
      const wasMouse = isMouseInteraction.current
      isMouseInteraction.current = false
      setIsFiltering(false)
      if (!wasMouse) openListbox()
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Don't close if focus moved to an option (mousedown on option fires before blur)
      if (listboxRef.current?.contains(e.relatedTarget as Node)) return
      closeListbox()
    }

    const handleMouseDown = () => {
      isMouseInteraction.current = true
    }

    const handleClick = () => {
      isMouseInteraction.current = false
      setIsFiltering(false)
      openListbox()
    }

    const handleOptionSelect = (option: string) => {
      if (!isControlled) setInternalValue(option)
      setInternalSelectedOption(option)
      onOptionSelect?.(option)
      setIsFiltering(false)
      closeListbox()
      inputRef.current?.focus()
    }

    const handleClear = () => {
      if (!isControlled) setInternalValue('')
      setInternalSelectedOption(undefined)
      setIsFiltering(false)
      closeListbox()
      onClear?.()
      inputRef.current?.focus()
    }

    const showClear = inputValue !== '' && !disabled && !readOnly

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (totalOptions === 0) return
          const isAlreadyOpen = listboxRef.current?.matches(':popover-open')
          if (!isAlreadyOpen) listboxRef.current?.showPopover()
          const startIndex =
            activeIndex === -1
              ? Math.max(
                  0,
                  effectiveSelected
                    ? filteredOptions.indexOf(effectiveSelected)
                    : 0,
                )
              : Math.min(activeIndex + 1, totalOptions - 1)
          setActiveIndex(startIndex)
          listboxRef.current
            ?.querySelector(`#${getOptionId(startIndex)}`)
            ?.scrollIntoView({ block: 'nearest' })
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (!listboxRef.current?.matches(':popover-open')) {
            listboxRef.current?.showPopover()
            const last = totalOptions - 1
            if (last >= 0) setActiveIndex(last)
            return
          }
          if (totalOptions === 0) return
          if (activeIndex === -1) {
            // Nothing focused yet — go to last item
            const last = totalOptions - 1
            setActiveIndex(last)
            listboxRef.current
              ?.querySelector(`#${getOptionId(last)}`)
              ?.scrollIntoView({ block: 'nearest' })
            return
          }
          if (activeIndex === 0) {
            // At first item — return focus to input
            setActiveIndex(-1)
            closeListbox()
            return
          }
          const prev = activeIndex - 1
          setActiveIndex(prev)
          listboxRef.current
            ?.querySelector(`#${getOptionId(prev)}`)
            ?.scrollIntoView({ block: 'nearest' })
          break
        }
        case 'Enter': {
          e.preventDefault()
          if (!listboxRef.current?.matches(':popover-open') || activeIndex < 0)
            break
          if (canAddCustomValue && activeIndex === addOptionIndex) {
            handleOptionSelect(inputValue.trim())
          } else if (filteredOptions[activeIndex]) {
            handleOptionSelect(filteredOptions[activeIndex])
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          closeListbox()
          break
        }
      }
    }

    // Sync isOpen from popover toggle event (covers light-dismiss too)
    const handleToggle = (e: React.SyntheticEvent<HTMLUListElement>) => {
      const toggleEvent = e.nativeEvent as ToggleEvent
      const open = toggleEvent.newState === 'open'
      setIsOpen(open)
      if (!open) setActiveIndex(-1)
    }

    useEffect(() => {
      if (!isOpen) return
      const count = totalOptions
      setAnnouncement(
        count === 0
          ? 'No results'
          : `${count} result${count === 1 ? '' : 's'} available`,
      )
    }, [totalOptions, isOpen])

    // Scroll selected option into view when listbox opens
    useEffect(() => {
      if (!isOpen || !effectiveSelected) return
      const index = filteredOptions.indexOf(effectiveSelected)
      if (index >= 0) {
        listboxRef.current
          ?.querySelector(`#${getOptionId(index)}`)
          ?.scrollIntoView({ block: 'nearest' })
      }
    }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

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
            className="anchor"
            style={{ '--menu-anchor': anchorName } as CSSProperties}
          >
            <Input
              ref={mergedRef}
              id={inputId}
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-activedescendant={
                activeIndex >= 0 ? getOptionId(activeIndex) : undefined
              }
              autoComplete="off"
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              hideErrorIcon
              value={inputValue}
              onChange={handleChange}
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-describedby={getDescribedBy({
                hasDescription: !!description,
                hasHelperMessage: !!helperMessage,
              })}
              startAdornment={
                <Icon
                  data={searchIcon}
                  className="search-icon"
                  data-color-appearance={iconTone}
                />
              }
              endAdornment={
                <Button
                  variant="ghost"
                  icon
                  round
                  size="small"
                  tone={invalid ? 'neutral' : 'accent'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  aria-label={clearLabel}
                  aria-hidden={!showClear}
                  tabIndex={showClear ? undefined : -1}
                  style={{ visibility: showClear ? 'visible' : 'hidden' }}
                >
                  <Icon data={close} />
                </Button>
              }
              {...inputProps}
            />
            <Menu
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              // auto: top-layer + light-dismiss (click outside closes)
              popover="auto"
              aria-label={typeof label === 'string' ? label : undefined}
              onToggle={handleToggle}
            >
              {totalOptions === 0 ? (
                <MenuItem aria-disabled="true">{noOptionsText}</MenuItem>
              ) : (
                <>
                  {filteredOptions.map((option, index) => (
                    <MenuItem
                      key={option}
                      id={getOptionId(index)}
                      role="option"
                      aria-selected={option === effectiveSelected}
                      active={activeIndex === index}
                      onMouseDown={() => handleOptionSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                  {canAddCustomValue && (
                    <MenuItem
                      id={getOptionId(addOptionIndex)}
                      role="option"
                      aria-selected={false}
                      active={activeIndex === addOptionIndex}
                      onMouseDown={() => handleOptionSelect(inputValue.trim())}
                    >
                      Add: &ldquo;{inputValue}&rdquo;
                    </MenuItem>
                  )}
                </>
              )}
            </Menu>
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
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      </div>
    )
  },
)

Autocomplete.displayName = 'Autocomplete'
