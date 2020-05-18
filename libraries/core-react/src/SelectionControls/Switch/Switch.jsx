import React, { useState } from 'react'
import PropTypes, { bool } from 'prop-types'
import styled from 'styled-components'
import { SwitchSmall } from './SwitchSmall'
import { SwitchDefault } from './SwitchDefault'

const StyledSwitch = styled.label`
  padding: 16px 0;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  border: none;
  background-color: transparent;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  position: relative;
`

export const Switch = ({ size, disabled, label, ...rest }) => {
  return (
    <StyledSwitch isDisabled={disabled}>
      {size === 'small' ? (
        <SwitchSmall disabled={disabled} {...rest} />
      ) : (
        <SwitchDefault disabled={disabled} {...rest} />
      )}

      <span>{label}</span>
    </StyledSwitch>
  )
}

Switch.propTypes = {
  size: PropTypes.oneOf(['default', 'small']),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

Switch.defaultProps = {
  size: 'default',

  disabled: false,
}
