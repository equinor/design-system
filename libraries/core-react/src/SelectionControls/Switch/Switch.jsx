import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SwitchSmall } from './SwitchSmall'
import { SwitchDefault } from './SwitchDefault'

import { switchControl as tokens } from './Switch.tokens'
import { typographyTemplate } from '../../_common/templates'

const { enabled } = tokens

const StyledSwitch = styled.label`
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  border: none;
  background-color: transparent;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  position: relative;
`

const Label = styled.span`
  ${typographyTemplate(enabled.typography)}
`

export const Switch = forwardRef(
  ({ size, disabled, label, className, ...rest }, ref) => {
    return (
      <StyledSwitch isDisabled={disabled} className={className}>
        {size === 'small' ? (
          <SwitchSmall disabled={disabled} {...rest} ref={ref} />
        ) : (
          <SwitchDefault disabled={disabled} {...rest} ref={ref} />
        )}

        <Label>{label}</Label>
      </StyledSwitch>
    )
  },
)

Switch.displayName = 'eds-switch'

Switch.propTypes = {
  /** Switch size, use the small version with caution */
  size: PropTypes.oneOf(['default', 'small']),
  /** If true, the switch will be disabled */
  disabled: PropTypes.bool,
  /** Label for the switch. Required to make it a11y compliant */
  label: PropTypes.string.isRequired,
  /** Additional class names */
  className: PropTypes.string,
}

Switch.defaultProps = {
  size: 'default',
  disabled: false,
  className: undefined,
}
