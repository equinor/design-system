import * as React from 'react'
import {
  useState,
  useRef,
  useEffect,
  InputHTMLAttributes,
  RefAttributes,
} from 'react'
import styled, { css } from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { search as tokens } from './Search.tokens'
import { Icon } from '../Icon'
import {
  spacingsTemplate,
  typographyTemplate,
  setReactInputValue,
} from '@utils'
import { useCombinedRefs } from '@hooks'

const icons = {
  search,
  close,
}

Icon.add(icons)

const {
  enabled: {
    placeholder,
    height,
    spacings,
    background,
    typography,
    icon,
    border,
    clickbounds,
  },
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
  border: ${border.width} solid ${border.color};
  z-index: 0;

  svg {
    fill: ${icon.color};
  }

  ${spacingsTemplate(spacings)}

  ${({ isFocused }) =>
    isFocused &&
    css`
      border: ${border.width} solid ${border.focus.color};
    `}

  &::placeholder {
    color: ${placeholder.color};
  }
  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          &:hover {
            border: ${border.width} solid ${border.focus.color};
            cursor: text;
          }
        `}

  &::after {
    z-index: -1;
    position: absolute;
    top: -${clickbounds.offset};
    left: 0;
    width: 100%;
    height: ${clickbounds.height};
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

const InsideButton = styled.div<InsideButtonProps>`
  display: flex;
  align-items: center;
  visibility: hidden;
  border-radius: ${icon.border.radius};
  z-index: 1;
  padding: 4px;
  height: 16px;
  width: 16px;
  position: relative;

  &::after {
    z-index: -1;
    position: absolute;
    top: -${icon.clickbounds.offset};
    left: 0;
    width: 100%;
    height: ${icon.clickbounds.height};
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

  ${({ isActive }) =>
    isActive &&
    css`
      visibility: visible;
      &:hover {
        cursor: pointer;
        background: ${icon.hover.background};
      }
    `}
`
type ControlledSearch = (
  props: SearchProps & RefAttributes<HTMLInputElement>,
  value: SearchProps['value'],
  defaultValue: SearchProps['defaultValue'],
) => SearchProps & RefAttributes<HTMLInputElement>

export type SearchProps = InputHTMLAttributes<HTMLInputElement>

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  function Search(
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
    const inputRef = useCombinedRefs(useRef<HTMLInputElement>(null), ref)

    const [state, setState] = useState({
      isActive,
      isFocused: false,
    })

    useEffect(() => {
      setState({ ...state, isActive })
    }, [value, defaultValue])

    const handleOnClick = () => {
      const inputEl = inputRef.current
      inputEl.focus()
    }
    const handleFocus = () => setState({ ...state, isFocused: true })
    const handleBlur = () => setState({ ...state, isFocused: false })
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsActive((event.target as HTMLInputElement).value)
    }

    const handleOnDelete = () => {
      const input = inputRef.current
      const clearedValue = ''
      setReactInputValue(input, clearedValue)
      setState({ ...state, isActive: false })
    }
    const setIsActive = (newValue: string) =>
      setState({ ...state, isActive: newValue !== '' })

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
    const size = 16

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
        ref: inputRef,
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
      size,
      role: 'button',
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        if (state.isActive) {
          handleOnDelete()
        }
      },
    }

    return (
      <Container {...containerProps}>
        <Icon name="search" title="search icon" size={size} />
        <Input {...inputProps} />
        <InsideButton {...clearButtonProps}>
          <Icon name="close" title="clear" size={size} />
        </InsideButton>
      </Container>
    )
  },
)

// Search.displayName = 'eds-search'
