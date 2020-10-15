import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { SwitchSmall } from './SwitchSmall'
import { SwitchDefault } from './SwitchDefault'

import { switchControl as tokens } from './Switch.tokens'
import { typographyTemplate } from '../../_common/templates'
import type { Size } from './Switch.types'

const { enabled } = tokens

type StyledProps = { isDisabled: boolean }

const StyledSwitch = styled.label<StyledProps>`
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

type Props = {
  /** Label for the switch. Required to make it a11y compliant */
  label: string
  /** Switch size, use the small version with caution */
  size?: Size
  /** If true, the switch will be disabled */
  disabled?: boolean
} & React.HTMLAttributes<HTMLInputElement>

export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ size = 'default', disabled, label, className, ...rest }, ref) => {
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
