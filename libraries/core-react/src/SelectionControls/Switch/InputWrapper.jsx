import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'

const { enabled, disabled: _disabled } = tokens

const BaseInputWrapper = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
`

const InputWrapperDefault = styled(BaseInputWrapper)`
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : enabled.hover.background};
  }
  /* Handle */
  &:hover > span:last-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.hover.handle.background};
  }
`
const InputWrapperSmall = styled(BaseInputWrapper)`
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : enabled.hover.background};
  }
  /* Track */
  &:hover > :first-child {
    background-color: ${({ disabled }) =>
      disabled ? _disabled.background : enabled.hover.track.small.background};
  }
  /* Handle */
  &:hover > span:last-child {
    background-color: ${({ disabled }) =>
      disabled
        ? enabled.handle.small.background
        : enabled.hover.handle.small.background};
  }
`

export const InputWrapper = ({ children, disabled, size }) => {
  return (
    <>
      {size === 'small' ? (
        <InputWrapperSmall disabled={disabled}>{children}</InputWrapperSmall>
      ) : (
        <InputWrapperDefault disabled={disabled}>
          {children}
        </InputWrapperDefault>
      )}
    </>
  )
}

InputWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'small']),
}

InputWrapper.defaultProps = {
  disabled: false,
  size: 'default',
}
