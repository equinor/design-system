import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'
import type { Size } from './Switch.types'

const { enabled, disabled: _disabled } = tokens

type StyledProps = Pick<Props, 'isDisabled'>

const BaseInputWrapper = styled.span<StyledProps>`
  width: ${enabled.clickSize};
  height: ${enabled.clickSize};
  border-radius: 50%;
  position: relative;
`

const InputWrapperDefault = styled(BaseInputWrapper)`
  &:hover {
    background-color: ${({ isDisabled }) =>
      isDisabled ? 'transparent' : enabled.hover.background};
  }
  &:hover > span:last-child {
    background-color: ${({ isDisabled }) =>
      isDisabled ? _disabled.background : enabled.hover.handle.background};
  }
`
const InputWrapperSmall = styled(BaseInputWrapper)`
  &:hover {
    background-color: ${({ isDisabled }) =>
      isDisabled ? 'transparent' : enabled.hover.background};
  }
`
type Props = {
  children: ReactNode
  isDisabled?: boolean
  size?: Size
}

export const InputWrapper = ({
  children,
  isDisabled,
  size = 'default',
}: Props): JSX.Element => {
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

InputWrapper.propTypes = {
  // Track and handle
  children: PropTypes.node.isRequired,
  // Whether styles should be reflecting disabled state or not
  isDisabled: PropTypes.bool,
  // Default or small version
  size: PropTypes.oneOf(['default', 'small']),
}

InputWrapper.defaultProps = {
  isDisabled: false,
  size: 'default',
}
