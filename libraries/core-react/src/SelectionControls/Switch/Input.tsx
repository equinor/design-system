import { forwardRef, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import type { Size } from './Switch.types'

const { enabled, disabled: _disabled } = tokens

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
    outline: ${enabled.outline};
  }
`

const SmallInput = styled(BaseInput)`
  &:checked + span > span:last-child {
    transform: translate(180%, -50%);
  }
  &[data-focus-visible-added]:focus + span :first-child {
    outline-offset: ${enabled.outlineOffsetSmall};
  }
  /*  Track */
  &:checked + span > span {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.track.small.background};
  }
  /* Handle */
  &:checked + span > span:last-child {
    background-color: ${enabled.handle.small.background};
  }
`
const DefaultInput = styled(BaseInput)`
  /*  Track */
  &:checked + span > span {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.track.activeBackground};
  }
  /* Handle */
  &:checked + span > span:last-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.handle.activeBackground};
    transform: translate(135%, -50%);
  }
  &[data-focus-visible-added]:focus + span :first-child {
    outline-offset: ${enabled.outlineOffset};
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
