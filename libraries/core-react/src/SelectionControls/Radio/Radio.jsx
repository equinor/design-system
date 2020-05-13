import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  radio_button_selected, // eslint-disable-line camelcase
  radio_button_unselected, // eslint-disable-line camelcase
} from '@equinor/eds-icons'
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
  /* & + span::before {
    content: '';
    display: inline-block;
    width: ${enabled.size}
    height: ${enabled.size}
    vertical-align: calc(-1 * ${enabled.size} / 4);
    border-radius: ${enabled.size};
    border: 3px solid #fff;
    box-shadow: 0 0 0 2px ${color.primary}; 
    margin-right: 0.75em;
    transition: 0.5s ease all; 
  
  }*/
  /* box-shadow: [horizontal offset] [vertical offset] [blur radius] [optional spread radius] [color]; */
/*   &:checked + span::before {
    background: ${({ disabled }) =>
      disabled ? color.disabled : color.primary};
  } */
  &:focus {
    outline: none;
  }
/*   &:hover:not(:disabled) + span::before {
    background: ${color.hover};
    box-shadow: 0 0 0 2px ${color.primary}, 0 0 0 16px ${color.hover};  
    border-color: ${color.hover}
  }
  &:hover:checked:not(:disabled) + span::before {
    background: ${color.primary};

  } */
  &[data-focus-visible-added]:focus + svg {
    outline: ${enabled.outline};
    outline-offset: ${enabled.outlineOffset};
  }

  &:not(:checked) ~ svg path[name='selected'] {
    display: none;
  }
  &:not(:checked) ~ svg path[name='unselected'] {
    display: inline;
  }
  &:checked ~ svg path[name='unselected'] {
    display: none;
  }
  &:checked ~ svg path[name='selected'] {
    display: inline;
  }
`

const StyledRadio = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const StyledPath = styled.path.attrs(({ icon }) => ({
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  d: icon.svgPathData,
}))``

const Svg = styled.svg.attrs(({ height, width, fill }) => ({
  name: null,
  xmlns: 'http://www.w3.org/2000/svg',
  height,
  width,
  fill,
}))``

// @TODO: klikk bounds fra token
const InputWrapper = styled.span`
  display: inline-flex;
  border-radius: 50%;
  padding: 12px;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : color.hover};
  }
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
  const iconSize = 24
  return (
    <StyledRadio disabled={disabled} className={className}>
      <InputWrapper disabled={disabled}>
        <Input {...rest} disabled={disabled} onChange={handleChange} />
        <Svg
          width={iconSize}
          height={iconSize}
          viewBox={`0 0 ${iconSize} ${iconSize}`}
          fill={disabled ? color.disabled : color.primary}
        >
          <StyledPath icon={radio_button_selected} name="selected" />
          <StyledPath icon={radio_button_unselected} name="unselected" />
        </Svg>
      </InputWrapper>
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
