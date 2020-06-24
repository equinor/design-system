import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { switchControl as tokens } from './Switch.tokens'

const { enabled, disabled: _disabled } = tokens

const BaseInput = styled.input.attrs(({ type = 'checkbox' }) => ({
  type,
}))`
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

export const Input = forwardRef(({ disabled, size, ...rest }, ref) => {
  return (
    <>
      {size === 'small' ? (
        <SmallInput {...rest} ref={ref} disabled={disabled} />
      ) : (
        <DefaultInput {...rest} ref={ref} disabled={disabled} />
      )}
    </>
  )
})

Input.displayName = 'eds-switch-input'

Input.propTypes = {
  // If true, the component will be disabled
  disabled: PropTypes.bool,
  // Switch size, use the small version with caution
  size: PropTypes.oneOf(['default', 'small']),
}

Input.defaultProps = {
  disabled: false,
  size: 'default',
}
