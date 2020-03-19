import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { search, close } from '@equinor/eds-icons'
import { search as tokens } from './Search.tokens'
import { Icon } from '../Icon'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'

const icons = {
  search,
  close,
}

Icon.add(icons)

const {
  enabled: { spacings, background, typography, icon, border, clickbounds },
} = tokens

const typeProps = ['text', 'search', 'password', 'email', 'number']

const Container = styled.div`
  position: relative;
  background: ${background};
  height: 36px;
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  box-sizing: border-box;
  border: ${border.width} solid ${border.color};
  z-index: 1;

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
/*
  &::after {
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
  } */
`

const Input = styled.input.attrs({
  ariaLabel: 'search',
})`
  min-height: 0;
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

const ActiveIcon = styled(Icon)`
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
  { onChange, ...rest },
  ref,
) {
  const [state, setState] = useState({
    value: '',
    isActive: false,
    isFocused: false,
  })

  const handleFocus = () => setState({ ...state, isFocused: true })
  const handleBlur = () => setState({ ...state, isFocused: false })
  const handleOnDelete = () =>
    setState({ ...state, isActive: false, value: '' })
  const handleOnChange = ({ target: { value } }) =>
    setState({ ...state, isActive: value !== '', value })

  const { value, isActive, isFocused } = state
  const size = 16

  const props = {
    ...rest,
    ref,
    value,
    type: 'search',
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
    <Container isFocused={isFocused}>
      <Icon name="search" size={size} />
      <Input {...props} />
      <ActiveIcon name="close" {...closeIconProps} />
    </Container>
  )
})

Search.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** onChange handler */
  onChange: PropTypes.func,
}

Search.defaultProps = {
  className: '',
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  onChange: undefined,
}

Search.displayName = 'eds-search'

Search.constants = {
  types: typeProps,
}
