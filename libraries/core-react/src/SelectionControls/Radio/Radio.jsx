import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { radio as tokens } from './Radio.tokens'

const { color, enabled } = tokens
const Input = styled.input.attrs(({ type = 'radio' }) => ({
  type,
}))`
  /* Visually hide the original radio input*/
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  & + span::before {
    content: '';
    display: inline-block;
    width: ${enabled.size}
    height: ${enabled.size}
    vertical-align: calc(-1 * ${enabled.size} / 4);
    border-radius: ${enabled.size};
    border: 3px solid #fff;
    box-shadow: 0 0 0 2px ${color.primary}; 
    margin-right: 0.75em;
   /*  transition: 0.5s ease all; */
  
  }
  /* box-shadow: [horizontal offset] [vertical offset] [blur radius] [optional spread radius] [color]; */
  &:checked + span::before {
    background: ${({ disabled }) =>
      disabled ? color.disabled : color.primary};
    /* box-shadow: 0 0 0 0.25em ${color.primary}; */
  }
  &:focus {
    outline: none;
  }
  &:hover:not(:disabled) + span::before {
    background: ${color.hover};
    box-shadow: 0 0 0 2px ${color.primary}, 0 0 0 16px ${color.hover};  
    border-color: ${color.hover}
  }
  &:hover:checked:not(:disabled) + span::before {
    background: ${color.primary};
    /* box-shadow: 0 0 0 0.25em ${color.primary}; */
  }
  &[data-focus-visible-added]:focus + span::before {
    outline: ${enabled.outline};
    outline-offset: ${enabled.outlineOffset};
  }
  &:disabled + span::before {
    box-shadow: 0 0 0 2px ${color.disabled};
  }
`

const StyledRadio = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 16px
   cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const Radio = ({
  label,
  disabled = false,
  onChange,
  className,
  ...rest
}) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event, event.target.value)
    }
  }
  return (
    <StyledRadio disabled={disabled} className={className}>
      <Input {...rest} disabled={disabled} onChange={handleChange} />
      <span>{label}</span>
    </StyledRadio>
  )
}

Radio.displayName = 'eds-Radio'

Radio.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
}

Radio.defaultProps = {
  disabled: false,
  onChange: undefined,
}
