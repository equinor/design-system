import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { BaseInput, BaseInputWrapper, GridWrapper } from './Switch.styles'
import { outlineTemplate } from '../../utils'

type StyledProps = { isDisabled: boolean }

const Input = styled(BaseInput)(
  ({
    disabled,
    theme: {
      states,
      entities: { handle, track },
    },
  }) => css`
    &[data-focus-visible-added]:focus + span {
      ${outlineTemplate(states.focus.outline)}
    }
    /*  Track */
    &:checked + span > span {
      background-color: ${disabled
        ? states.disabled.background
        : track.states.active.background};
    }
    /* Handle */
    &:checked + span > span:last-child {
      transform: translate(180%, -50%);
      background-color: ${handle.background};
    }
    @media (hover: hover) and (pointer: fine) {
      &:hover + span {
        background-color: ${disabled ? 'transparent' : states.hover.background};
      }
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
    width: ${track.width};
    height: ${track.height};
    border-radius: 10px;
    border: none;
    background-color: ${isDisabled
      ? states.disabled.background
      : track.states.disabled.background};
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `,
)

const Handle = styled.span(
  ({
    theme: {
      entities: { handle },
    },
  }) => css`
    background-color: ${handle.background};
    width: ${handle.width};
    height: ${handle.height};
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translate(11%, -50%);
    left: 7px;
    transition: transform 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  `,
)

type SwitchSmallProps = {
  disabled?: boolean
}

export const SwitchSmall = forwardRef<HTMLInputElement, SwitchSmallProps>(
  function SwitchSmall({ disabled, ...rest }, ref) {
    return (
      <GridWrapper>
        <Input {...rest} ref={ref} disabled={disabled} />
        <BaseInputWrapper>
          <Track isDisabled={disabled} />
          <Handle />
        </BaseInputWrapper>
      </GridWrapper>
    )
  },
)

SwitchSmall.displayName = 'SwitchSmall'
