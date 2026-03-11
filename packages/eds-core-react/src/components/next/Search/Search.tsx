import { forwardRef, useRef, useState, useCallback } from 'react'
import { search as searchIcon, close } from '@equinor/eds-icons'
import type { SearchProps } from './Search.types'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Button } from '../Button'
import { Icon } from '../Icon'
import './search.css'

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    label,
    description,
    helperMessage,
    id: providedId,
    invalid,
    disabled,
    readOnly,
    value,
    defaultValue,
    onChange,
    onClear,
    clearLabel = 'Clear search',
    ...inputProps
  },
  forwardedRef,
) {
  const { inputId, labelId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds(providedId)

  const isControlled = value !== undefined
  const [internalHasValue, setInternalHasValue] = useState(() =>
    Boolean(defaultValue),
  )
  const hasValue = isControlled ? Boolean(value) : internalHasValue

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalHasValue(Boolean(e.target.value))
    }
    onChange?.(e)
  }

  const handleClear = () => {
    if (!isControlled && inputRef.current) {
      // Direct DOM mutation: bypasses React's synthetic onChange, which is
      // intentional — onClear is the designated callback for clear actions.
      inputRef.current.value = ''
      setInternalHasValue(false)
    }
    onClear?.()
    inputRef.current?.focus()
  }

  const showClear = hasValue && !disabled && !readOnly
  // Accent only in interactive states — grey in error, readonly, disabled
  const iconTone = disabled || readOnly || invalid ? 'neutral' : 'accent'

  return (
    <search
      className="eds-search"
      aria-labelledby={label ? labelId : undefined}
    >
      <Field disabled={disabled}>
        {label && (
          <Field.Label id={labelId} htmlFor={inputId}>
            {label}
          </Field.Label>
        )}
        {description && (
          <Field.Description id={descriptionId}>
            {description}
          </Field.Description>
        )}
        <Input
          ref={mergedRef}
          id={inputId}
          type="search"
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-describedby={getDescribedBy({
            hasDescription: !!description,
            hasHelperMessage: !!helperMessage,
          })}
          hideErrorIcon
          startAdornment={
            <Icon
              data={searchIcon}
              className="search-icon"
              data-color-appearance={iconTone}
            />
          }
          endAdornment={
            showClear ? (
              <Button
                variant="ghost"
                icon
                round
                size="small"
                tone={invalid ? 'neutral' : 'accent'}
                onClick={handleClear}
                aria-label={clearLabel}
              >
                <Icon data={close} />
              </Button>
            ) : undefined
          }
          {...inputProps}
        />
        {helperMessage && (
          <Field.HelperMessage
            id={helperMessageId}
            role={invalid ? 'alert' : undefined}
          >
            {helperMessage}
          </Field.HelperMessage>
        )}
      </Field>
    </search>
  )
})

Search.displayName = 'Search'
