import {
  useState,
  useRef,
  useEffect,
  InputHTMLAttributes,
  RefAttributes,
  forwardRef,
} from 'react'
import styled, { css } from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { search as tokens } from './Search.tokens'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  spacingsTemplate,
  typographyTemplate,
  setReactInputValue,
  bordersTemplate,
} from '../../utils'
import { useCombinedRefs } from '../../hooks'

const {
  height,
  spacings,
  background,
  typography,
  border,
  clickbound,
  entities: { icon, placeholder, button },
  states,
} = tokens

type ContainerProps = {
  isFocused: boolean
  disabled: boolean
}

const Container = styled.span<ContainerProps>`
  position: relative;
  background: ${background};
  width: 100%;
  height: ${height};
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content auto max-content;
  align-items: center;
  box-sizing: border-box;
  ${bordersTemplate(border)}
  z-index: 0;

  svg {
    fill: ${icon.typography.color};
  }

  ${spacingsTemplate(spacings)}

  ${({ isFocused }) =>
    isFocused &&
    css`
      ${bordersTemplate(states.focus.border)}
    `}

  &::placeholder {
    color: ${placeholder.typography.color};
  }
  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              ${bordersTemplate(states.focus.border)}
              cursor: text;
            }
          }
        `}

  &::after {
    z-index: -1;
    position: absolute;
    top: -${clickbound.offset};
    left: 0;
    width: 100%;
    height: ${clickbound.height};
    content: '';
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    min-height: auto;
    content: '';
  }
`

const Input = styled.input`
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  appearance: none;
  box-sizing: border-box;
  background: transparent;

  &[type='search']::-webkit-search-decoration,
  &[type='search']::-webkit-search-cancel-button,
  &[type='search']::-webkit-search-results-button,
  &[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  ${typographyTemplate(typography)}

  &:focus {
    outline: none;
  }
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `}
`

type InsideButtonProps = {
  isActive: boolean
}

const InsideButton = styled(Button)<InsideButtonProps>`
  visibility: hidden;
  position: absolute;
  right: ${button.spacings.right};
  height: ${button.height};
  width: ${button.width};

  ${({ isActive }) =>
    isActive &&
    css`
      visibility: visible;
    `}
`

type ControlledSearch = (
  props: SearchProps & RefAttributes<HTMLInputElement>,
  value: SearchProps['value'],
  defaultValue: SearchProps['defaultValue'],
) => SearchProps & RefAttributes<HTMLInputElement>

export type SearchProps = InputHTMLAttributes<HTMLInputElement>

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    onChange,
    defaultValue = '',
    value,
    className = '',
    disabled = false,
    onBlur,
    onFocus,
    ...rest
  },
  ref,
) {
  const isControlled = typeof value !== 'undefined'
  const isActive = (isControlled && value !== '') || defaultValue !== ''
  const inputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState({
    isActive,
    isFocused: false,
  })

  useEffect(() => {
    setState((prevState) => ({ ...prevState, isActive }))
  }, [value, defaultValue, isActive])

  const handleOnClick = () => {
    const inputEl = inputRef.current
    inputEl.focus()
  }
  const handleFocus = () =>
    setState((prevState) => ({ ...prevState, isFocused: true }))
  const handleBlur = () =>
    setState((prevState) => ({ ...prevState, isFocused: false }))
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive((event.target as HTMLInputElement).value)
  }

  const handleOnDelete = () => {
    const input = inputRef.current
    const clearedValue = ''
    setReactInputValue(input, clearedValue)
    setState((prevState) => ({ ...prevState, isActive: false }))
  }
  const setIsActive = (newValue: string) =>
    setState((prevState) => ({ ...prevState, isActive: newValue !== '' }))

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

  const { isFocused } = state
  const size = 24

  const containerProps = {
    isFocused,
    className,
    disabled,
    role: 'search',
    'aria-label': rest['aria-label'],
    onClick: handleOnClick,
  }

  const inputProps = applyControllingProps(
    {
      ...rest,
      disabled,
      ref: useCombinedRefs<HTMLInputElement>(inputRef, ref),
      type: 'search',
      role: 'searchbox',
      'aria-label': 'search input',
      onBlur: (e) => {
        handleBlur()
        if (onBlur) {
          onBlur(e)
        }
      },
      onFocus: (e) => {
        handleFocus()
        if (onFocus) {
          onFocus(e)
        }
      },
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

  const clearButtonProps = {
    isActive: state.isActive,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      if (state.isActive) {
        handleOnDelete()
      }
    },
  }

  return (
    <Container {...containerProps}>
      <Icon data={search} aria-hidden size={size} />
      <Input {...inputProps} />
      <InsideButton
        {...clearButtonProps}
        aria-label={'clear search'}
        title="clear"
        variant="ghost_icon"
      >
        <Icon data={close} size={16} />
      </InsideButton>
    </Container>
  )
})

// Search.displayName = 'eds-search'
