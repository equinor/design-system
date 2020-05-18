import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'

const { enabled } = tokens

const InputWrapper = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : enabled.hover.background};
  }
`

export const SwitchInputWrapper = ({ children, disabled }) => {
  return <InputWrapper disabled={disabled}>{children}</InputWrapper>
}

SwitchInputWrapper.propTypes = {}

SwitchInputWrapper.defaultProps = {}
