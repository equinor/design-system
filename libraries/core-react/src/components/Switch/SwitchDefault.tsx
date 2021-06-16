import { forwardRef } from 'react'
import styled from 'styled-components'
import { comfortable as tokens } from './Switch.tokens'
import { bordersTemplate } from '../../utils'
import { BaseInput, BaseInputWrapper } from './Switch.styles'

const {
  entities: { track, handle },
} = tokens

type StyledProps = { isDisabled: boolean }

const Wrapper = styled(BaseInputWrapper)<StyledProps>`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isDisabled }) =>
        isDisabled ? 'transparent' : tokens.states.hover.background};
    }
    &:hover > span:last-child {
      background-color: ${({ isDisabled }) =>
        isDisabled
          ? tokens.states.disabled.background
          : tokens.states.hover.entities.handle.background};
    }
  }
`

const Input = styled(BaseInput)`
  /*  Track */
  &:checked + span > span {
    background-color: ${({ disabled }) =>
      disabled
        ? tokens.states.disabled.background
        : tokens.entities.track.states.active.background};
  }
  /* Handle */
  &:checked + span > span:last-child {
    transform: translate(135%, -50%);
    background-color: ${({ disabled }) =>
      disabled
        ? tokens.states.disabled.background
        : tokens.entities.handle.states.active.background};
  }
`

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
        <Wrapper isDisabled={disabled}>
          <Track isDisabled={disabled} />
          <Handle isDisabled={disabled} />
        </Wrapper>
      </>
    )
  },
)

SwitchDefault.displayName = 'SwitchDefault'
