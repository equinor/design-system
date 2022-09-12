import {
  useState,
  useRef,
  InputHTMLAttributes,
  RefAttributes,
  forwardRef,
  useMemo,
  ChangeEvent,
} from 'react'
import styled from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Input, InputProps } from '../Input'
import { setReactInputValue, mergeRefs } from '@equinor/eds-utils'

const SearchInput = styled(Input)`
  input {
    &[type='search']::-webkit-search-decoration,
    &[type='search']::-webkit-search-cancel-button,
    &[type='search']::-webkit-search-results-button,
    &[type='search']::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }
  }
`

const InsideButton = styled(Button)`
  height: 24px;
  width: 24px;
`

type ControlledSearch = (
  props: SearchProps & RefAttributes<HTMLInputElement>,
  value: SearchProps['value'],
  defaultValue: SearchProps['defaultValue'],
) => SearchProps & RefAttributes<HTMLInputElement>

export type SearchProps = InputHTMLAttributes<HTMLInputElement>

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { defaultValue = '', onChange, value, disabled = false, ...rest },
  ref,
) {
  const isControlled = typeof value !== 'undefined'
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = useState(false)

  const clearInputValue = () => {
    const input = inputRef.current
    const clearedValue = ''
    setReactInputValue(input, clearedValue)
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.currentTarget.value))
  }

  /** Applying props for controlled vs. uncontrolled scnarios */
  const applyControllingProps: ControlledSearch = (
    props,
    value,
    defaultValue,
  ): SearchProps => {
    if (isControlled) {
      return {
        ...props,
        value,
      }
    }

    return {
      ...props,
      defaultValue,
    }
  }

  const combinedRef = useMemo(
    () => mergeRefs<HTMLInputElement>(inputRef, ref),
    [inputRef, ref],
  )

  const inputProps: InputProps = applyControllingProps(
    {
      disabled,
      ref: combinedRef,
      type: 'search',
      role: 'searchbox',
      'aria-label': 'search input',

      ...rest,
      onChange: (e) => {
        handleOnChange(e)
        if (onChange) {
          onChange(e)
        }
      },
    },
    value,
    defaultValue,
  )

  return (
    <SearchInput
      leftAdornmentsWidth={24 + 8}
      leftAdornments={<Icon data={search} aria-hidden size={18} />}
      rightAdornmentsWidth={24 + 8}
      rightAdornments={
        <>
          {hasValue && (
            <InsideButton
              aria-label={'clear search'}
              title="clear"
              variant="ghost_icon"
              onClick={(e: ChangeEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                clearInputValue()
              }}
            >
              <Icon data={close} size={16} />
            </InsideButton>
          )}
        </>
      }
      {...inputProps}
    />
  )
})

// Search.displayName = 'eds-search'
