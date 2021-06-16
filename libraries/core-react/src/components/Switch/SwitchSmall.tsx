import { forwardRef } from 'react'
import styled from 'styled-components'
import { comfortable as tokens } from './Switch.tokens'
import { BaseInput, BaseInputWrapper } from './Switch.styles'

const {
  entities: { track, handle },
} = tokens.modes.compact

type StyledProps = { isDisabled: boolean }

const Wrapper = styled(BaseInputWrapper)<StyledProps>`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isDisabled }) =>
        isDisabled ? 'transparent' : tokens.states.hover.background};
    }
  }
`

const Input = styled(BaseInput)`
  &[data-focus-visible-added]:focus + span :first-child {
    outline-offset: 4px;
  }
  /*  Track */
  &:checked + span > span {
    background-color: ${({ disabled }) =>
      disabled
        ? tokens.states.disabled.background
        : track.states.active.background};
  }
  /* Handle */
  &:checked + span > span:last-child {
    transform: translate(180%, -50%);
    background-color: ${handle.background};
  }
`

const Track = styled.span<StyledProps>`
  width: ${track.width};
  height: ${track.height};
  border-radius: 10px;
  border: none;
  background-color: ${({ isDisabled }) =>
    isDisabled
      ? tokens.states.disabled.background
      : track.states.disabled.background};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Handle = styled.span`
  background-color: ${handle.background};
  width: ${handle.width};
  height: ${handle.height};
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
        <Input {...rest} ref={ref} disabled={disabled} />
        <Wrapper isDisabled={disabled}>
          <Track isDisabled={disabled} />
          <Handle />
        </Wrapper>
      </>
    )
  },
)

SwitchSmall.displayName = 'SwitchSmall'
