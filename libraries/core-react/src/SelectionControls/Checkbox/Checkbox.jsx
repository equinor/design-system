import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// eslint-disable-next-line camelcase
import { checkbox, checkbox_outline } from '@equinor/eds-icons'
import { checkbox as tokens } from './Checkbox.tokens'

import { Icon } from '../..'

Icon.add({ checkbox, checkbox_outline })
const { color, enabled } = tokens

const StyledCheckbox = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 16px
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const Input = styled.input.attrs(({ type = 'checkbox' }) => ({
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
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus + svg {
    outline: ${enabled.outline};
    outline-offset: ${enabled.outlineOffset};
  }
`

// @TODO: klikk bounds fra token
const InputWrapper = styled.span`
  display: inline-flex;
  border-radius: 50%;
  padding: 12px;
  &:hover {
    background-color: ${color.hover};
  }
`

export const Checkbox = ({ label, disabled, checked, onChange, ...rest }) => {
  const [isChecked, updateIsChecked] = useState(checked)
  const handleInputChange = (event) => {
    const { target } = event
    updateIsChecked(target.checked)
    if (onChange) {
      onChange(event, target.value)
    }
  }

  return (
    <StyledCheckbox disabled={disabled}>
      <InputWrapper disabled={disabled}>
        <Input
          {...rest}
          disabled={disabled}
          checked={isChecked}
          onChange={handleInputChange}
        />
        {isChecked ? (
          <Icon
            name="checkbox"
            size={24}
            color={disabled ? color.disabled : color.primary}
          />
        ) : (
          <Icon
            name="checkbox_outline"
            size={24}
            color={disabled ? color.disabled : color.primary}
            aria-hidden
          />
        )}
      </InputWrapper>
      <span>{label}</span>
    </StyledCheckbox>
  )
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
}

Checkbox.defaultProps = {
  disabled: false,
  checked: false,
  onChange: undefined,
}
