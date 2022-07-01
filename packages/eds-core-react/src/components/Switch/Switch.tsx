import { forwardRef, InputHTMLAttributes } from 'react'
import styled, { ThemeProvider, css } from 'styled-components'
import { SwitchSmall } from './SwitchSmall'
import { SwitchDefault } from './SwitchDefault'
import { comfortable as tokens } from './Switch.tokens'
import { typographyTemplate, useToken } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'

type StyledProps = { isDisabled: boolean }

const StyledLabel = styled.label<StyledProps>`
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  border: none;
  background-color: transparent;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  position: relative;
`

const Label = styled.span(
  ({ theme }) => css`
    ${typographyTemplate(theme.typography)}
    margin-left: ${theme.entities.label.spacings.left};
  `,
)

export type SwitchProps = {
  /** Label for the switch. Required to make it a11y compliant */
  label?: string
  /** Switch size, use the small version with caution */
  size?: 'default' | 'small'
  /** If true, the switch will be disabled */
  disabled?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size = 'default', disabled, label, className, style, ...rest },
  ref,
) {
  const { density } = useEds()
  // TODO Temporary workaround untill we can deprecate "size" property (controlled by EdsProvider in the future)
  const overrideDensity = size === 'small' ? 'compact' : density
  const token = useToken({ density: overrideDensity }, tokens)

  return (
    <ThemeProvider theme={token}>
      {label ? (
        <StyledLabel isDisabled={disabled} className={className} style={style}>
          {size === 'small' ? (
            <SwitchSmall disabled={disabled} {...rest} ref={ref} />
          ) : (
            <SwitchDefault disabled={disabled} {...rest} ref={ref} />
          )}
          {label && <Label>{label}</Label>}
        </StyledLabel>
      ) : size === 'small' ? (
        <SwitchSmall
          disabled={disabled}
          className={className}
          style={style}
          {...rest}
          ref={ref}
        />
      ) : (
        <SwitchDefault
          disabled={disabled}
          className={className}
          style={style}
          {...rest}
          ref={ref}
        />
      )}
    </ThemeProvider>
  )
})

Switch.displayName = 'Switch'
