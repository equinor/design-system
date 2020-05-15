import React, { useState } from 'react'
import PropTypes, { bool } from 'prop-types'
import styled from 'styled-components'

import { switchControl as tokens } from './Switch.tokens'

const { enabled, color, disabled: _disabled } = tokens

const StyledSwitch = styled.label`
  padding: 16px 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: none;
  background-color: transparent;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  position: relative;
`

const InputWrapper = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : enabled.hover.background};
  }
`

const Input = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
  role: 'switch',
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
  &[data-focus-visible-added]:focus + span {
    outline: ${enabled.outline};
    outline-offset: ${enabled.outlineOffset};
  }
  &:checked + span :first-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.track.activeBackground};
  }
  &:checked + span :last-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.handle.activeBackground};
    transform: translate(135%, -50%);
  }
`

const Track = styled.span`
  width: ${enabled.track.width};
  height: 8px;
  border-radius: ${enabled.track.borderRadius};
  border: none;
  background-color: ${enabled.track.background};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.36s;
`

const Handle = styled.span`
  background-color: ${enabled.handle.background};
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
  transform: translate(0, -50%);
  left: 6px;
  transition: all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`

export const Switch = ({ size, disabled, label, ...rest }) => {
  return (
    <StyledSwitch disabled={disabled}>
      <Input {...rest} disabled={disabled} />
      <InputWrapper disabled={disabled}>
        <Track disabled={disabled} />
        <Handle disabled={disabled} />
      </InputWrapper>
      <span>{label}</span>
    </StyledSwitch>
  )
}

Switch.propTypes = {
  size: PropTypes.oneOf(['large', 'small']),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

Switch.defaultProps = {
  size: 'large',

  disabled: false,
}
