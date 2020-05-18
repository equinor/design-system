import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import { SwitchInputWrapper } from './SwitchInputWrapper'

const { enabled, disabled: _disabled } = tokens

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
  &:checked + span > span {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.track.activeBackground};
  }
  &:checked + span > span:last-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.handle.activeBackground};
    transform: translate(135%, -50%);
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
  transition: background 0.36s;
  ${({ disabled }) =>
    disabled && {
      backgroundColor: _disabled.background,
    }}
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
  transition: transform 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`

export const SwitchDefault = ({ disabled, ...rest }) => {
  return (
    <>
      <Input {...rest} disabled={disabled} />
      <SwitchInputWrapper disabled={disabled}>
        <Track disabled={disabled} />
        <Handle disabled={disabled} />
      </SwitchInputWrapper>
    </>
  )
}

SwitchDefault.propTypes = {
  disabled: PropTypes.bool,
}

SwitchDefault.defaultProps = {
  disabled: false,
}
