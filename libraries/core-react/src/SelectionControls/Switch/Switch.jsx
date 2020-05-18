import React from 'react'
import PropTypes from 'prop-types'
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
  /** Switch size, use the small version with caution */
  size: PropTypes.oneOf(['default', 'small']),
  /** If true, the switch will be disabled */
  disabled: PropTypes.bool,
  /** Label for the switch. Required to make it a11y compliant */
  label: PropTypes.string.isRequired,
}

Switch.defaultProps = {
  size: 'default',
  disabled: false,
}
