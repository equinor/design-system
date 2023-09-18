import {
  useState,
  useRef,
  InputHTMLAttributes,
  forwardRef,
  useMemo,
  ChangeEvent,
  MouseEvent,
  useEffect,
} from 'react'
import styled from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { InputWrapper } from '../InputWrapper'
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

export type SearchProps = InputHTMLAttributes<HTMLInputElement>

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { onChange, style, className, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showClear, setShowClear] = useState(Boolean(rest.defaultValue))

  useEffect(() => {
    if (rest.disabled) {
      setShowClear(false)
    } else if (rest.value) {
      setShowClear(Boolean(rest.value))
    }
  }, [rest.value, rest.disabled])

  const clearInputValue = () => {
    const input = inputRef.current
    const clearedValue = ''
    setReactInputValue(input, clearedValue)
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowClear(Boolean(e.currentTarget.value))
  }

  const combinedRef = useMemo(
    () => mergeRefs<HTMLInputElement>(inputRef, ref),
    [inputRef, ref],
  )

  return (
    <InputWrapper role="search" style={style} className={className}>
      <SearchInput
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleOnChange(e)
          if (onChange) {
            onChange(e)
          }
        }}
        ref={combinedRef}
        leftAdornmentsWidth={24 + 8}
        leftAdornments={<Icon data={search} aria-hidden size={18} />}
        rightAdornmentsWidth={24 + 8}
        rightAdornments={
          <>
            {showClear && (
              <InsideButton
                aria-label={'clear search'}
                title="clear"
                variant="ghost_icon"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  clearInputValue()
                }}
              >
                <Icon data={close} size={16} />
              </InsideButton>
            )}
          </>
        }
        {...rest}
      />
    </InputWrapper>
  )
})
