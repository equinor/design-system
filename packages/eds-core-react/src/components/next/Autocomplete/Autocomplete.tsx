import {
  forwardRef,
  useId,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type CSSProperties,
  type KeyboardEvent,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes,
} from 'react'
import { search as searchIcon, close, add_box } from '@equinor/eds-icons'
import type { AutocompleteProps } from './Autocomplete.types'
import {
  defaultOptionsFilter,
  isOptionDisabled,
  resolveOptionKey,
  resolveOptionLabel,
} from '../utils/selectOptions'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Icon } from '../Icon'
import { Button } from '../Button'
import { Menu, MenuItem } from '../Menu'
// TODO: replace with next/Progress when available
import { Progress } from '../../Progress'

type OptionItem<T> =
  | { type: 'list'; value: T }
  | { type: 'custom'; value: string }

function AutocompleteInner<T = string>(
  {
    label,
    description,
    helperMessage,
    id: providedId,
    options = [],
    getOptionLabel,
    value,
    onValueChange,
    noOptionsText = 'No options',
    allowCustomValue,
    onCustomValueConfirm,
    onClear,
    clearLabel = 'Clear',
    loading,
    loadingText = 'Loading\u2026',
    disabled,
    readOnly,
    invalid,
    inputValue: inputValueProp,
    defaultInputValue,
    onChange,
    onInputChange,
    getOptionValue,
    optionDisabled,
    optionsFilter,
    renderOption,
    ...inputProps
  }: AutocompleteProps<T>,
  forwardedRef: ForwardedRef<HTMLInputElement>,
): ReactElement | null {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds(providedId)
  const uid = useId()
  const listboxId = `eds-autocomplete-listbox-${uid.replace(/:/g, '')}`
  const anchorName = `--eds-autocomplete-${uid.replace(/:/g, '')}`

  const getLabelFn = (option: T | string): string =>
    resolveOptionLabel(option, getOptionLabel)

  // Tracks whether the search input text is controlled via the `inputValue` prop.
  // The selected value (value/onValueChange) has its own control semantics.
  const isControlled = inputValueProp !== undefined
  const [internalValue, setInternalValue] = useState(
    () => defaultInputValue ?? (value !== undefined ? getLabelFn(value) : ''),
  )
  const inputValue = isControlled ? String(inputValueProp) : internalValue

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isFiltering, setIsFiltering] = useState(false)
  const suppressNextFocusOpen = useRef(false)
  const [internalSelectedOption, setInternalSelectedOption] = useState<
    T | string | undefined
  >(() => value)
  const effectiveSelected: T | string | undefined =
    value ?? internalSelectedOption

  const prevValueRef = useRef<T | undefined>(value)

  // Sync input text when the external value prop changes and inputValue is not controlled.
  // getLabelFn is intentionally omitted from deps: an inline getOptionLabel creates
  // a new function reference every parent render, which would re-fire the effect and
  // overwrite mid-typed input. When value actually changes the component re-renders,
  // so getLabelFn is already current in the closure.
  // Only clears when value transitions from defined → undefined (parent clears selection).
  // Skips the clear on initial mount so defaultInputValue is not overwritten.
  useEffect(() => {
    if (isControlled) return
    if (value !== undefined) {
      setInternalValue(getLabelFn(value))
      setInternalSelectedOption(value)
    } else if (prevValueRef.current !== undefined) {
      setInternalValue('')
      setInternalSelectedOption(undefined)
    }
    prevValueRef.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isControlled])

  const [announcement, setAnnouncement] = useState('')
  const [customOptions, setCustomOptions] = useState<string[]>([])
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

  const allItems = useMemo<OptionItem<T>[]>(
    () => [
      ...options.map((o) => ({ type: 'list' as const, value: o })),
      ...customOptions
        .filter(
          (o) =>
            !options.some(
              (opt) =>
                resolveOptionLabel(opt, getOptionLabel).toLowerCase() ===
                o.toLowerCase(),
            ),
        )
        .map((o) => ({ type: 'custom' as const, value: o })),
    ],
    [options, customOptions, getOptionLabel],
  )

  const matchesFilter = useCallback(
    (item: OptionItem<T>, text: string): boolean => {
      if (item.type === 'custom') return defaultOptionsFilter(item.value, text)
      if (optionsFilter) return optionsFilter(item.value, text)
      return defaultOptionsFilter(item.value, text, getOptionLabel)
    },
    [optionsFilter, getOptionLabel],
  )

  const filteredItems = useMemo<OptionItem<T>[]>(
    () =>
      isFiltering
        ? allItems.filter((item) => matchesFilter(item, inputValue))
        : allItems,
    [allItems, isFiltering, inputValue, matchesFilter],
  )

  const customValueTyped =
    allowCustomValue &&
    isFiltering &&
    inputValue.trim() !== '' &&
    filteredItems.length === 0

  const totalOptions = filteredItems.length + (allowCustomValue ? 1 : 0)

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
    const newValue = e.target.value
    if (!isControlled) setInternalValue(newValue)
    onChange?.(e)
    onInputChange?.(newValue)
    setIsFiltering(true)
    if (canOpen) listboxRef.current?.showPopover()

    // Can't use filteredItems here — inputValue state hasn't updated yet
    const newFiltered = allItems.filter((item) => matchesFilter(item, newValue))
    const willHaveCustomValue =
      allowCustomValue && newValue.trim() !== '' && newFiltered.length === 0

    if (newFiltered.length === 1) {
      setActiveIndex(allowCustomValue ? 1 : 0)
    } else if (willHaveCustomValue) {
      setActiveIndex(0)
    } else {
      setActiveIndex(-1)
    }
  }

  // Event order for mouse clicks: pointerdown → (Popover light-dismiss if open)
  // → focus → mouseup → click. handleMouseDown sets suppressNextFocusOpen so
  // that the focus handler (which fires mid-sequence) doesn't immediately reopen
  // the popover. handleClick then opens it at the correct time. The same flag is
  // reused after programmatic focus (option select / clear) to prevent reopen.
  const handleFocus = () => {
    const wasMouse = suppressNextFocusOpen.current
    suppressNextFocusOpen.current = false
    setIsFiltering(false)
    if (!wasMouse) openListbox()
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't close if focus moved to an option (mousedown on option fires before blur)
    if (listboxRef.current?.contains(e.relatedTarget as Node)) return
    closeListbox()
  }

  const handleMouseDown = () => {
    suppressNextFocusOpen.current = true
  }

  const handleClick = () => {
    suppressNextFocusOpen.current = false
    setIsFiltering(false)
    openListbox()
  }

  const handleListOptionSelect = (option: T) => {
    if (!isControlled)
      setInternalValue(resolveOptionLabel(option, getOptionLabel))
    setInternalSelectedOption(option)
    onValueChange?.(option)
    setIsFiltering(false)
    closeListbox()
    // Mark as programmatic re-focus so handleFocus doesn't reopen the listbox
    suppressNextFocusOpen.current = true
    inputRef.current?.focus()
  }

  const handleCustomOptionSelect = (text: string) => {
    setCustomOptions((prev) =>
      prev.some((o) => o.toLowerCase() === text.toLowerCase())
        ? prev
        : [...prev, text],
    )
    if (!isControlled) setInternalValue(text)
    setInternalSelectedOption(text)
    onCustomValueConfirm?.(text)
    setIsFiltering(false)
    closeListbox()
    suppressNextFocusOpen.current = true
    inputRef.current?.focus()
  }

  const handleItemSelect = (item: OptionItem<T>) => {
    if (item.type === 'custom') {
      handleCustomOptionSelect(item.value)
    } else {
      handleListOptionSelect(item.value)
    }
  }

  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    setInternalSelectedOption(undefined)
    onValueChange?.(undefined)
    setIsFiltering(false)
    closeListbox()
    onClear?.()
    suppressNextFocusOpen.current = true
    inputRef.current?.focus()
  }

  const showClear = inputValue !== '' && !disabled && !readOnly

  const isItemSelected = (item: OptionItem<T>): boolean => {
    if (effectiveSelected === undefined) return false
    if (item.type === 'custom') {
      return (
        typeof effectiveSelected === 'string' &&
        item.value.toLowerCase() === (effectiveSelected as string).toLowerCase()
      )
    }
    if (getOptionValue) {
      // If effectiveSelected is a string here, it's a custom value — not a list item
      if (typeof effectiveSelected === 'string') return false
      return (
        getOptionValue(item.value) === getOptionValue(effectiveSelected as T)
      )
    }
    return item.value === effectiveSelected
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        if (totalOptions === 0) return
        const isAlreadyOpen = listboxRef.current?.matches(':popover-open')
        if (!isAlreadyOpen) listboxRef.current?.showPopover()
        const selectedItemIndex = effectiveSelected
          ? filteredItems.findIndex((item) => isItemSelected(item))
          : -1
        const startIndex =
          activeIndex === -1
            ? Math.max(
                0,
                selectedItemIndex >= 0
                  ? selectedItemIndex + (allowCustomValue ? 1 : 0)
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
        if (!listboxRef.current?.matches(':popover-open')) break
        if (activeIndex < 0) {
          // No keyboard navigation yet — confirm custom value directly if available
          if (customValueTyped) handleCustomOptionSelect(inputValue.trim())
          break
        }
        if (allowCustomValue && activeIndex === 0) {
          if (customValueTyped) handleCustomOptionSelect(inputValue.trim())
        } else {
          const optionIndex = allowCustomValue ? activeIndex - 1 : activeIndex
          const item = filteredItems[optionIndex]
          if (item) {
            const isDisabled =
              item.type === 'list' &&
              isOptionDisabled(item.value, optionDisabled)
            if (!isDisabled) handleItemSelect(item)
          }
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

  // Clamp activeIndex when options shrink (e.g. async search returning fewer results)
  useEffect(() => {
    setActiveIndex((prev) => (prev >= totalOptions ? -1 : prev))
  }, [totalOptions])

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
    const selectedItemIndex = filteredItems.findIndex((item) =>
      isItemSelected(item),
    )
    if (selectedItemIndex >= 0) {
      const displayIndex = allowCustomValue
        ? selectedItemIndex + 1
        : selectedItemIndex
      listboxRef.current
        ?.querySelector(`#${getOptionId(displayIndex)}`)
        ?.scrollIntoView({ block: 'nearest' })
    }
    // effectiveSelected and filteredItems are intentionally omitted — this effect
    // only needs to scroll once when the listbox opens, not on every filter change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

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
            startAdornment={<Icon data={searchIcon} className="search-icon" />}
            endAdornment={
              loading ? (
                <Progress.Circular size={16} />
              ) : (
                <Button
                  variant="ghost"
                  icon
                  round
                  size="small"
                  tone={invalid ? 'neutral' : 'accent'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  aria-label={clearLabel}
                  inert={!showClear || undefined}
                  style={{ visibility: showClear ? 'visible' : 'hidden' }}
                >
                  <Icon data={close} />
                </Button>
              )
            }
            {...inputProps}
          />
          <Menu
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            // auto: top-layer + light-dismiss (click outside closes)
            popover="auto"
            aria-labelledby={inputId}
            onToggle={handleToggle}
          >
            {loading ? (
              <MenuItem role="presentation" data-status>
                {loadingText}
              </MenuItem>
            ) : totalOptions === 0 ? (
              <MenuItem role="presentation" data-status>
                {noOptionsText}
              </MenuItem>
            ) : (
              <>
                {allowCustomValue && (
                  <MenuItem
                    id={getOptionId(0)}
                    role="option"
                    aria-selected={false}
                    aria-disabled={!customValueTyped}
                    aria-label={
                      customValueTyped ? `Add: ${inputValue.trim()}` : undefined
                    }
                    aria-posinset={1}
                    aria-setsize={totalOptions}
                    active={activeIndex === 0}
                    className="add-option"
                    onMouseDown={
                      customValueTyped
                        ? () => handleCustomOptionSelect(inputValue.trim())
                        : undefined
                    }
                    onClick={() => {
                      if (
                        customValueTyped &&
                        listboxRef.current?.matches(':popover-open')
                      )
                        handleCustomOptionSelect(inputValue.trim())
                    }}
                  >
                    <Icon data={add_box} aria-hidden="true" />
                    {customValueTyped
                      ? `Add: ${inputValue.trim()}`
                      : 'Type to add new option'}
                  </MenuItem>
                )}
                {filteredItems.map((item, index) => {
                  const label = getLabelFn(item.value)
                  const displayIndex = allowCustomValue ? index + 1 : index
                  const selected = isItemSelected(item)
                  const optionIsDisabled =
                    item.type === 'list' &&
                    isOptionDisabled(item.value, optionDisabled)
                  return (
                    <MenuItem
                      key={
                        item.type === 'list'
                          ? resolveOptionKey(
                              item.value,
                              getOptionValue,
                              getOptionLabel,
                            )
                          : label
                      }
                      id={getOptionId(displayIndex)}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={optionIsDisabled || undefined}
                      aria-posinset={displayIndex + 1}
                      aria-setsize={totalOptions}
                      active={activeIndex === displayIndex}
                      onMouseDown={
                        optionIsDisabled
                          ? undefined
                          : () => handleItemSelect(item)
                      }
                      onClick={() => {
                        if (
                          !optionIsDisabled &&
                          listboxRef.current?.matches(':popover-open')
                        )
                          handleItemSelect(item)
                      }}
                    >
                      {item.type === 'list' && renderOption
                        ? renderOption(item.value, { isSelected: selected })
                        : label}
                    </MenuItem>
                  )
                })}
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
      <div role="status" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}

const AutocompleteForwardRef = forwardRef(AutocompleteInner)
AutocompleteForwardRef.displayName = 'Autocomplete'

export const Autocomplete = AutocompleteForwardRef as unknown as <T = string>(
  props: AutocompleteProps<T> & RefAttributes<HTMLInputElement>,
) => ReactElement | null
