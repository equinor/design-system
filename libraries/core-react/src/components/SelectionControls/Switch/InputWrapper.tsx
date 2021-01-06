import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import type { Size } from './Switch.types'

const { enabled, disabled: _disabled } = tokens

type StyledProps = Pick<InputWrapperProps, 'isDisabled'>

const BaseInputWrapper = styled.span<StyledProps>`
  width: ${enabled.clickSize};
  height: ${enabled.clickSize};
  border-radius: 50%;
  position: relative;
`

const InputWrapperDefault = styled(BaseInputWrapper)`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isDisabled }) =>
        isDisabled ? 'transparent' : enabled.hover.background};
    }
    &:hover > span:last-child {
      background-color: ${({ isDisabled }) =>
        isDisabled ? _disabled.background : enabled.hover.handle.background};
    }
  }
`
const InputWrapperSmall = styled(BaseInputWrapper)`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isDisabled }) =>
        isDisabled ? 'transparent' : enabled.hover.background};
    }
  }
`

type InputWrapperProps = {
  children: ReactNode
  isDisabled?: boolean
  size?: Size
}

export const InputWrapper = ({
  children,
  isDisabled,
  size = 'default',
}: InputWrapperProps): JSX.Element => {
  return (
    <>
      {size === 'small' ? (
        <InputWrapperSmall isDisabled={isDisabled}>
          {children}
        </InputWrapperSmall>
      ) : (
        <InputWrapperDefault isDisabled={isDisabled}>
          {children}
        </InputWrapperDefault>
      )}
    </>
  )
}
