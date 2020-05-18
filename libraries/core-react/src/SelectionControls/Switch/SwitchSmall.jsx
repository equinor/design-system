import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import { InputWrapper } from './InputWrapper'
import { Input } from './Input'

const { enabled, disabled: _disabled } = tokens

const Track = styled.span`
  width: ${enabled.track.small.width};
  height: ${enabled.track.small.height};
  border-radius: 10px;
  border: none;
  background-color: ${({ disabled }) =>
    disabled ? _disabled.background : enabled.track.small.background};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Handle = styled.span`
  background-color: ${enabled.handle.small.background};
  width: ${enabled.handle.small.size};
  height: ${enabled.handle.small.size};
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 15px;
  transition: transform 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`

export const SwitchSmall = ({ disabled, ...rest }) => {
  return (
    <>
      <Input {...rest} disabled={disabled} size="small" />
      <InputWrapper disabled={disabled} size="small">
        <Track disabled={disabled} />
        <Handle disabled={disabled} />
      </InputWrapper>
    </>
  )
}

SwitchSmall.propTypes = {
  disabled: PropTypes.bool,
}

SwitchSmall.defaultProps = {
  disabled: false,
}
