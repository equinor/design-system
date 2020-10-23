import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import { InputWrapper } from './InputWrapper'
import { Input } from './Input'

const { enabled, disabled: _disabled } = tokens

type StyledProps = { isDisabled: boolean }

const Track = styled.span<StyledProps>`
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
  ${({ isDisabled }) =>
    isDisabled && {
      backgroundColor: _disabled.background,
    }}
`
const Handle = styled.span<StyledProps>`
  background-color: ${enabled.handle.background};
  ${({ isDisabled }) =>
    isDisabled && {
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

type Props = {
  disabled?: boolean
}

export const SwitchDefault = forwardRef<HTMLInputElement, Props>(
  ({ disabled, ...rest }, ref) => {
    return (
      <>
        <Input {...rest} ref={ref} disabled={disabled} />
        <InputWrapper isDisabled={disabled}>
          <Track isDisabled={disabled} />
          <Handle isDisabled={disabled} />
        </InputWrapper>
      </>
    )
  },
)

SwitchDefault.displayName = 'SwitchDefault'
