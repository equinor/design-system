import React, { useState } from 'react'
import PropTypes, { bool } from 'prop-types'
import styled from 'styled-components'

import { switchControl as tokens } from './Switch.tokens'

const { enabled, color, disabled: _disabled } = tokens

const StyledSwitch = styled.button.attrs(({ type = 'button' }) => ({
  type,
  role: 'switch',
}))`
  padding: 16px 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  width: 48px;
  height: 48px;
  border: none;
  background-color: transparent;
  vertical-align: middle;
  border-radius: 50%;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : enabled.hover.background};
  }
  &:focus {
    outline: none;
  }
`

const Track = styled.span`
  width: ${enabled.track.width};
  height: 8px;
  border-radius: ${enabled.track.borderRadius};
  border: none;
  background-color: ${({ checked }) =>
    checked ? enabled.track.activeBackground : enabled.track.background};
  ${({ disabled }) =>
    disabled && {
      backgroundColor: _disabled.background,
    }}
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.36s;
`

const Handle = styled.span`
  background-color: ${({ checked }) =>
    checked ? enabled.handle.activeBackground : enabled.handle.background};
  ${({ disabled }) =>
    disabled && {
      backgroundColor: _disabled.background,
    }}
  box-shadow: ${enabled.handle.boxShadow};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transform: ${({ checked }) =>
    checked ? 'translate(-100%, -50%)' : 'translateX(0, -50%)'};
  left: ${({ checked }) => (checked ? '90%' : '10%')};
  transition: all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`

export const Switch = ({
  size,
  disabled,
  checked,
  onChange,
  ariaLabelledby,
  ...rest
}) => {
  const [active, setActive] = useState(checked)
  const handleSwitchClick = (event) => {
    setActive(!active)
    if (onChange) {
      onChange(active, event)
    }
  }
  return (
    <StyledSwitch
      {...rest}
      checked={active}
      onClick={handleSwitchClick}
      aria-checked={active}
      disabled={disabled}
      aria-labelledby={ariaLabelledby}
    >
      <Track checked={active} disabled={disabled}></Track>
      <Handle checked={active} disabled={disabled}></Handle>
    </StyledSwitch>
  )
}

Switch.propTypes = {
  size: PropTypes.oneOf(['large', 'small']),
  checked: bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  ariaLabelledby: PropTypes.string.isRequired,
}

Switch.defaultProps = {
  size: 'large',
  checked: false,
  onChange: undefined,
  disabled: false,
}
