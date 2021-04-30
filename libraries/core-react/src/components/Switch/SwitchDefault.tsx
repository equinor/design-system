import { forwardRef } from 'react'
import styled from 'styled-components'
import { comfortable as tokens } from './Switch.tokens'
import { InputWrapper } from './InputWrapper'
import { Input } from './Input'
import { bordersTemplate } from '../../utils'

const {
  entities: { track, handle },
} = tokens

type StyledProps = { isDisabled: boolean }

const Track = styled.span<StyledProps>`
  ${bordersTemplate(track.border)}
  border: none;

  width: ${track.width};
  height: ${track.height};
  background-color: ${track.background};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: background 0.36s;
  ${({ isDisabled }) =>
    isDisabled && {
      backgroundColor: tokens.states.disabled.background,
    }}
`
const Handle = styled.span<StyledProps>`
  background-color: ${handle.background};
  ${({ isDisabled }) =>
    isDisabled && {
      backgroundColor: tokens.states.disabled.background,
    }}
  box-shadow: ${handle.boxShadow};
  width: ${handle.width};
  height: ${handle.height};
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 6px;
  transition: transform 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`

type SwitchDefaultProps = {
  disabled?: boolean
}

export const SwitchDefault = forwardRef<HTMLInputElement, SwitchDefaultProps>(
  function SwitchDefault({ disabled, ...rest }, ref) {
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
