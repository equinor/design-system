import React, { useState } from 'react'
import PropTypes, { bool } from 'prop-types'
import styled from 'styled-components'
import { SwitchSmall } from './SwitchSmall'
import { SwitchDefault } from './SwitchDefault'
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
  /* Visually hide the original checkbox*/
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
  &:checked + span {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.track.activeBackground};
  }
  &:checked ~ span:last-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.handle.activeBackground};
    transform: ${({ size }) =>
      size === 'small' ? 'translate(180%, -50%)' : 'translate(135%, -50%)'};
  }
`

const Track = styled.span`
  width: ${enabled.track.width};
  height: ${enabled.track.height};
  border-radius: ${enabled.track.borderRadius};
  border: none;
  background-color: ${enabled.track.background};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.36s;
  ${({ disabled }) =>
    disabled && {
      backgroundColor: _disabled.background,
    }}
`
const SmallTrack = styled(Track)`
  width: ${enabled.track.small.width};
  height: ${enabled.track.small.height};
  border-radius: 10px;
  background-color: ${enabled.track.small.background};
`

const Handle = styled.span`
  background-color: ${enabled.handle.background};
  ${({ disabled }) =>
    disabled && {
      backgroundColor: _disabled.background,
    }}
  box-shadow: ${enabled.handle.boxShadow};
  width: ${enabled.handle.size};
  height: ${enabled.handle.size};
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 6px;
  transition: all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`
const SmallHandle = styled(Handle)`
  width: ${enabled.handle.small.size};
  height: ${enabled.handle.small.size};
  box-shadow: none;
  background-color: white;
  left: 15px;
`

export const Switch = ({ size, disabled, label, ...rest }) => {
  return (
    <StyledSwitch disabled={disabled}>
      <InputWrapper disabled={disabled}>
        {size === 'small' ? (
          <SwitchSmall disabled={disabled} {...rest} />
        ) : (
          <SwitchDefault disabled={disabled} {...rest} />
        )}
      </InputWrapper>
      <span>{label}</span>
    </StyledSwitch>
  )
}

Switch.propTypes = {
  size: PropTypes.oneOf(['default', 'small']),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

Switch.defaultProps = {
  size: 'default',

  disabled: false,
}
