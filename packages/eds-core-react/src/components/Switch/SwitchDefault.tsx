import { forwardRef, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { bordersTemplate } from '@equinor/eds-utils'
import { BaseInput, BaseInputWrapper, GridWrapper } from './Switch.styles'

const Input = styled(BaseInput)(
  ({ theme }) => css`
    width: ${theme.clickbound.height};
    aspect-ratio: 1/1;
    /*  Track */
    &:checked + span > span {
      background-color: ${theme.entities.track.states.active.background};
    }
    /* Handle */
    &:checked + span > span:last-child {
      transform: translate(105%, -50%);
      background-color: ${theme.entities.handle.states.active.background};
    }
    &:hover:not(:disabled) + span {
      background-color: ${theme.states.hover.background};
    }
    &:hover:not(:disabled) + span > span:last-child {
      background-color: ${theme.states.hover.entities.handle.background};
    }
    /* :is(:first-child, :last-child) matches both track and handle and lifts
       the specificity to tie the :checked handle rule above, so this later
       rule wins when disabled — don't simplify to a bare "+ span > span" */
    &:disabled + span > span:is(:first-child, :last-child) {
      background-color: ${theme.states.disabled.background};
    }
  `,
)

const Track = styled.span(
  ({
    theme: {
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
  `,
)
const Handle = styled.span(
  ({
    theme: {
      entities: { handle },
    },
  }) => css`
    background-color: ${handle.background};
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
          <Track />
          <Handle />
        </BaseInputWrapper>
      </GridWrapper>
    )
  },
)

SwitchDefault.displayName = 'SwitchDefault'
