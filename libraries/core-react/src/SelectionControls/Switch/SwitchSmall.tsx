import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import { InputWrapper } from './InputWrapper'
import { Input } from './Input'

const { enabled, disabled: _disabled } = tokens

type StyledProps = { isDisabled: boolean }

const Track = styled.span<StyledProps>`
  width: ${enabled.track.small.width};
  height: ${enabled.track.small.height};
  border-radius: 10px;
  border: none;
  background-color: ${({ isDisabled }) =>
    isDisabled ? _disabled.background : enabled.track.small.offBackground};
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
  transform: translate(11%, -50%);
  left: 15px;
  transition: transform 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`

type SwitchSmallProps = {
  disabled?: boolean
}

export const SwitchSmall = forwardRef<HTMLInputElement, SwitchSmallProps>(
  function SwitchSmall({ disabled, ...rest }, ref) {
    return (
      <>
        <Input {...rest} ref={ref} disabled={disabled} size="small" />
        <InputWrapper isDisabled={disabled} size="small">
          <Track isDisabled={disabled} />
          <Handle />
        </InputWrapper>
      </>
    )
  },
)

SwitchSmall.displayName = 'SwitchSmall'
