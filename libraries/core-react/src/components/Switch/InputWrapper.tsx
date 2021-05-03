import { ReactNode } from 'react'
import styled from 'styled-components'
import { comfortable as tokens } from './Switch.tokens'
import type { Size } from './Switch.types'

type StyledProps = Pick<InputWrapperProps, 'isDisabled'>

const BaseInputWrapper = styled.span<StyledProps>`
  width: ${tokens.clickbound.width};
  height: ${tokens.clickbound.height};
  border-radius: 50%;
  position: relative;
`

const InputWrapperDefault = styled(BaseInputWrapper)`
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
const InputWrapperSmall = styled(BaseInputWrapper)`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ isDisabled }) =>
        isDisabled ? 'transparent' : tokens.states.hover.background};
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
