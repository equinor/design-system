import { forwardRef, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import {
  comfortable as tokens,
  compact as compactTokens,
} from './Switch.tokens'
import type { Size } from './Switch.types'
import { outlineTemplate } from '../../../utils'

// const { enabled, disabled: _disabled } = tokens

type StyledProps = Pick<InputProps, 'disabled'>

const BaseInput = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))<StyledProps>`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus + span :first-child {
    ${outlineTemplate(tokens.states.focus.outline)}
  }
`

const SmallInput = styled(BaseInput)`
  &[data-focus-visible-added]:focus + span :first-child {
    outline-offset: 4px;
  }
  /*  Track */
  &:checked + span > span {
    background-color: ${({ disabled }) =>
      disabled
        ? tokens.states.disabled.background
        : compactTokens.entities.track.background};
  }
  /* Handle */
  &:checked + span > span:last-child {
    transform: translate(180%, -50%);
    background-color: ${compactTokens.entities.handle.background};
  }
`
const DefaultInput = styled(BaseInput)`
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

type InputProps = {
  size?: Size
  disabled?: boolean
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'default', ...rest },
  ref,
) {
  return (
    <>
      {size === 'small' ? (
        <SmallInput {...rest} ref={ref} />
      ) : (
        <DefaultInput {...rest} ref={ref} />
      )}
    </>
  )
})

Input.displayName = 'Input'
