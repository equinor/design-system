import { forwardRef, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { BaseInput, BaseInputWrapper, GridWrapper } from './Switch.styles'
import { outlineTemplate } from '@equinor/eds-utils'

const Input = styled(BaseInput)(
  ({
    theme: {
      states,
      entities: { handle, track },
    },
  }) => css`
    &[data-focus-visible-added]:focus + span {
      ${outlineTemplate(states.focus.outline)}
    }
    &:focus-visible + span {
      ${outlineTemplate(states.focus.outline)}
    }
    /*  Track */
    &:checked + span > span {
      background-color: ${track.states.active.background};
    }
    /* Handle */
    &:checked + span > span:last-child {
      transform: translate(180%, -50%);
      background-color: ${handle.background};
    }
    /* :first-child targets only the track; the handle keeps its colour when
       disabled. Higher specificity than the checked rule above, so disabled
       wins for checked + disabled */
    &:disabled + span > span:first-child {
      background-color: ${states.disabled.background};
    }
    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) + span {
        background-color: ${states.hover.background};
      }
    }
  `,
)

const Track = styled.span(
  ({
    theme: {
      entities: { track },
    },
  }) => css`
    width: ${track.width};
    height: ${track.height};
    border-radius: 10px;
    border: none;
    background-color: ${track.states.disabled.background};
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
} & InputHTMLAttributes<HTMLInputElement>

export const SwitchSmall = forwardRef<HTMLInputElement, SwitchSmallProps>(
  function SwitchSmall({ disabled, className, style, ...rest }, ref) {
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

SwitchSmall.displayName = 'SwitchSmall'
