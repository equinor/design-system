import {
  useState,
  useRef,
  useEffect,
  InputHTMLAttributes,
  RefAttributes,
  forwardRef,
} from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { search as searchToken } from './Search.tokens'
import { useEds } from '../EdsProvider'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Input } from '../Input'
import {
  spacingsTemplate,
  typographyTemplate,
  setReactInputValue,
  bordersTemplate,
  useCombinedRefs,
  useToken,
} from '@equinor/eds-utils'

type ContainerProps = {
  isFocused: boolean
  disabled: boolean
}

const Container = styled.span<ContainerProps>(
  ({ disabled, isFocused, theme }) => {
    const {
      height,
      spacings,
      background,
      border,
      clickbound,
      entities: { icon, placeholder },
      states,
    } = theme

    return css`
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

      ${isFocused && bordersTemplate(states.focus.border)}


    &::placeholder {
        color: ${placeholder.typography.color};
      }
      ${disabled
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
  },
)

const SearchInput = styled(Input)(({ theme, disabled }) => {
  return css`
    height: calc(${theme.height} - 2px);
    align-self: start;
    box-shadow: unset;
    &[type='search']::-webkit-search-decoration,
    &[type='search']::-webkit-search-cancel-button,
    &[type='search']::-webkit-search-results-button,
    &[type='search']::-webkit-search-results-decoration {
      -webkit-appearance: none;
    }

    ${typographyTemplate(theme.typography)}

    &:focus {
      outline: none;
    }
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px ${theme.background} inset;
    }
    &:autofill {
      box-shadow: 0 0 0px 1000px ${theme.background} inset;
    }
    ${disabled &&
    css`
      cursor: not-allowed;
    `}
  `
})

type InsideButtonProps = {
  isActive: boolean
}

const InsideButton = styled(Button)<InsideButtonProps>(
  ({ theme, isActive }) => {
    const {
      entities: { button },
    } = theme

    return css`
      visibility: hidden;
      position: absolute;
      right: ${button.spacings.right};
      height: ${button.height};
      width: ${button.width};

      ${isActive &&
      css`
        visibility: visible;
      `}
    `
  },
)

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
    style,
    disabled = false,
    onBlur,
    onFocus,
    ...rest
  },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, searchToken)

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
    style,
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
    <ThemeProvider theme={token}>
      <Container {...containerProps}>
        <Icon data={search} aria-hidden size={size} />
        <SearchInput {...inputProps} />
        <InsideButton
          {...clearButtonProps}
          aria-label={'clear search'}
          title="clear"
          variant="ghost_icon"
        >
          <Icon data={close} size={16} />
        </InsideButton>
      </Container>
    </ThemeProvider>
  )
})

// Search.displayName = 'eds-search'
