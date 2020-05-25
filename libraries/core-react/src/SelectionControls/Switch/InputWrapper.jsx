import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'

const { enabled, disabled: _disabled } = tokens

const BaseInputWrapper = styled.span`
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
  /* Handle */
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

export const InputWrapper = ({ children, isDisabled, size }) => {
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
