import { forwardRef, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { bordersTemplate } from '@equinor/eds-utils'
import { BaseInput, BaseInputWrapper, GridWrapper } from './Switch.styles'

type StyledProps = { $isDisabled: boolean }

const Input = styled(BaseInput)(
  ({ disabled, theme }) => css`
    width: ${theme.clickbound.height};
    aspect-ratio: 1/1;
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
    &:hover + span {
      background-color: ${disabled
        ? 'transparent'
        : theme.states.hover.background};
    }
    &:hover + span > span:last-child {
      background-color: ${disabled
        ? theme.states.disabled.background
        : theme.states.hover.entities.handle.background};
    }
  `,
)

const Track = styled.span<StyledProps>(
  ({
    $isDisabled,
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
    ${$isDisabled && {
      backgroundColor: states.disabled.background,
    }}
  `,
)
const Handle = styled.span<StyledProps>(
  ({
    $isDisabled,
    theme: {
      states,
      entities: { handle },
    },
  }) => css`
    background-color: ${handle.background};
    ${$isDisabled && {
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
} & InputHTMLAttributes<HTMLInputElement>

export const SwitchDefault = forwardRef<HTMLInputElement, SwitchDefaultProps>(
  function SwitchDefault({ disabled, className, style, ...rest }, ref) {
    return (
      <GridWrapper className={className} style={style}>
        <Input {...rest} ref={ref} disabled={disabled} />
        <BaseInputWrapper>
          <Track $isDisabled={disabled} />
          <Handle $isDisabled={disabled} />
        </BaseInputWrapper>
      </GridWrapper>
    )
  },
)

SwitchDefault.displayName = 'SwitchDefault'
