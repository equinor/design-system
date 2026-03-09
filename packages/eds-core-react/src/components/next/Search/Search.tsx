import { forwardRef, useRef, useState, useCallback } from 'react'
import { search as searchIcon, close, info_circle } from '@equinor/eds-icons'
import type { SearchProps } from './Search.types'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Button } from '../Button'
import { Tooltip } from '../../Tooltip'
import { Icon } from '../Icon'
import './search.css'

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    label,
    labelInfo,
    indicator,
    description,
    helperMessage,
    id: providedId,
    invalid = false,
    disabled = false,
    readOnly,
    value,
    defaultValue,
    onChange,
    onClear,
    ...inputProps
  },
  forwardedRef,
) {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds(providedId)

  const isControlled = value !== undefined
  const [internalHasValue, setInternalHasValue] = useState(() =>
    Boolean(defaultValue),
  )
  const hasValue = isControlled ? Boolean(value) : internalHasValue

  const inputRef = useRef<HTMLInputElement>(null)

  const mergedRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        ;(
          forwardedRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node
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
      inputRef.current.value = ''
      setInternalHasValue(false)
    }
    onClear?.()
    inputRef.current?.focus()
  }

  const showClear = hasValue && !disabled && !readOnly

  return (
    <Field disabled={disabled} className="eds-search">
      {label && (
        <div className="eds-search__header">
          <Field.Label htmlFor={inputId} indicator={indicator}>
            {label}
          </Field.Label>
          {labelInfo && (
            <Tooltip title={labelInfo} placement="top">
              <Button
                variant="ghost"
                icon
                round
                size="small"
                tone="neutral"
                className="eds-search__info"
                aria-label="More information"
              >
                <Icon data={info_circle} size="xs" />
              </Button>
            </Tooltip>
          )}
        </div>
      )}
      {description && (
        <Field.Description id={descriptionId}>{description}</Field.Description>
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
        startAdornment={<Icon data={searchIcon} />}
        endAdornment={
          showClear ? (
            <Button
              variant="ghost"
              icon
              round
              size="small"
              tone="neutral"
              onClick={handleClear}
              aria-label="Clear search"
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
  )
})

Search.displayName = 'Search'
