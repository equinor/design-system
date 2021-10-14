import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { bordersTemplate } from '../../utils'
import { BaseInput, BaseInputWrapper, GridWrapper } from './Switch.styles'

type StyledProps = { isDisabled: boolean }

const Wrapper = styled(BaseInputWrapper)<StyledProps>(
  ({ isDisabled, theme }) => css`
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: ${isDisabled
          ? 'transparent'
          : theme.states.hover.background};
      }
      &:hover > span:last-child {
        background-color: ${isDisabled
          ? theme.states.disabled.background
          : theme.states.hover.entities.handle.background};
      }
    }
  `,
)

const Input = styled(BaseInput)(
  ({ disabled, theme }) => css`
    /*  Track */
    &:checked + span > span {
      background-color: ${disabled
        ? theme.states.disabled.background
        : theme.entities.track.states.active.background};
    }
    /* Handle */
    &:checked + span > span:last-child {
      transform: translate(105%, -50%);
      background-color: ${disabled
        ? theme.states.disabled.background
        : theme.entities.handle.states.active.background};
    }
  `,
)

const Track = styled.span<StyledProps>(
  ({
    isDisabled,
    theme: {
      states,
      entities: { track },
    },
  }) => css`
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
    ${isDisabled && {
      backgroundColor: states.disabled.background,
    }}
  `,
)
const Handle = styled.span<StyledProps>(
  ({
    isDisabled,
    theme: {
      states,
      entities: { handle },
    },
  }) => css`
    background-color: ${handle.background};
    ${isDisabled && {
      backgroundColor: states.disabled.background,
    }}
    box-shadow: ${handle.boxShadow};
    width: ${handle.width};
    height: ${handle.height};
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 4px;
    transition: transform 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  `,
)

type SwitchDefaultProps = {
  disabled?: boolean
}

export const SwitchDefault = forwardRef<HTMLInputElement, SwitchDefaultProps>(
  function SwitchDefault({ disabled, ...rest }, ref) {
    return (
      <GridWrapper>
        <Input {...rest} ref={ref} disabled={disabled} />
        <Wrapper isDisabled={disabled}>
          <Track isDisabled={disabled} />
          <Handle isDisabled={disabled} />
        </Wrapper>
      </GridWrapper>
    )
  },
)

SwitchDefault.displayName = 'SwitchDefault'
