import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { search as tokens } from './Search.tokens'
import { Icon } from '../Icon'
import { setReactInputValue, useCombinedRefs, templates } from '../_common'

const icons = {
  search,
  close,
}

const { spacingsTemplate, typographyTemplate } = templates

Icon.add(icons)

const {
  enabled: {
    height,
    spacings,
    background,
    typography,
    icon,
    border,
    clickbounds,
  },
} = tokens

const typeProps = ['text', 'search', 'password', 'email', 'number']

const Container = styled.span.attrs({
  role: 'search',
})`
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

  ${spacingsTemplate(spacings)}

  ${({ isFocused }) =>
    isFocused &&
    css`
      border: ${border.width} solid ${border.focus.color};
    `}

  &:hover {
    border: ${border.width} solid ${border.focus.color};
    cursor: text;
  }

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

const Input = styled.input.attrs({
  type: 'search',
  role: 'searchbox',
  'aria-label': 'search input',
})`
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
`

const ActiveIcon = styled(Icon).attrs({
  role: 'button',
})`
  visibility: hidden;
  padding: 1px;
  border-radius: ${icon.border.radius};
  z-index: 1;

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

export const Search = React.forwardRef(function EdsSearch(
  { onChange, value: initValue, ...rest },
  ref,
) {
  const inputRef = useCombinedRefs(useRef(null), ref)
  const [state, setState] = useState({
    value: initValue,
    isActive: initValue !== '',
    isFocused: false,
  })

  const handleFocus = () => setState({ ...state, isFocused: true })
  const handleBlur = () => setState({ ...state, isFocused: false })
  const handleOnDelete = () => {
    const input = inputRef.current
    const value = ''
    setReactInputValue(input, value)
    setState({ ...state, isActive: false, value })
  }

  const handleOnChange = ({ target: { value } }) =>
    setState({ ...state, isActive: value !== '', value })

  const { value, isActive, isFocused } = state
  const size = 16

  const props = {
    ...rest,
    value,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onChange: (e) => {
      handleOnChange(e)
      if (onChange) {
        onChange(e)
      }
    },
  }

  const closeIconProps = {
    size,
    isActive,
    onClick: () => isActive && handleOnDelete(),
  }

  return (
    <Container isFocused={isFocused} aria-label={rest['aria-label']}>
      <Icon name="search" title="search icon" size={size} />
      <Input {...props} ref={inputRef} />
      <ActiveIcon name="close" title="clear button" {...closeIconProps} />
    </Container>
  )
})

Search.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** onChange handler */
  onChange: PropTypes.func,
  /** Value for search field */
  value: PropTypes.string,
}

Search.defaultProps = {
  className: '',
  placeholder: '',
  disabled: false,
  onChange: undefined,
  value: '',
}

Search.displayName = 'eds-search'

Search.constants = {
  types: typeProps,
}
