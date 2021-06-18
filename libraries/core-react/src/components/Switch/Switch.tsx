import { forwardRef, Ref, InputHTMLAttributes } from 'react'
import styled, { ThemeProvider, css } from 'styled-components'
import { SwitchSmall } from './SwitchSmall'
import { SwitchDefault } from './SwitchDefault'
import { comfortable as tokens } from './Switch.tokens'
import { typographyTemplate } from '../../utils'
import { useToken } from '../../hooks'
import { useEds } from '../EdsProvider'

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

const Label = styled.span(
  ({ theme: { token } }) => css`
    ${typographyTemplate(token.typography)}
    margin-left: ${token.entities.label.spacings.left};
  `,
)

export type SwitchProps = {
  /** Label for the switch. Required to make it a11y compliant */
  label: string
  /** Switch size, use the small version with caution */
  size?: 'default' | 'small'
  /** If true, the switch will be disabled */
  disabled?: boolean
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    ref?: Ref<HTMLInputElement>
  }

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size = 'default', disabled, label, className, ...rest },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, tokens)()

  return (
    <ThemeProvider theme={{ token }}>
      <StyledSwitch isDisabled={disabled} className={className}>
        {size === 'small' ? (
          <SwitchSmall disabled={disabled} {...rest} ref={ref} />
        ) : (
          <SwitchDefault disabled={disabled} {...rest} ref={ref} />
        )}

        <Label>{label}</Label>
      </StyledSwitch>
    </ThemeProvider>
  )
})

Switch.displayName = 'Switch'
