import { HTMLAttributes, forwardRef, ReactNode, useMemo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useToken } from '@equinor/eds-utils'
import { Label as _Label } from '../Label'
import { HelperText as _HelperText } from './HelperText'
import { useEds } from './../EdsProvider'
import { inputToken as tokens } from './InputWrapper.tokens'

const Container = styled.div``

const HelperText = styled(_HelperText)`
  margin-top: 8px;
  margin-left: 8px;
`

const Label = styled(_Label)`
  margin-left: 8px;
  margin-right: 8px;
`

export type InputWrapperProps = {
  /** Label */
  label?: string
  /** Meta */
  meta?: string
  /** Disabled state */
  disabled?: boolean
  /** Read Only */
  readOnly?: boolean
  /** Helper text icon */
  helperIcon?: ReactNode
  /** Helper text */
  helperText?: string
  /** Highlight color */
  color?: 'error' | 'warning' | 'success'
} & HTMLAttributes<HTMLDivElement>

export const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(
  function InputWrapper(
    { label, meta, children, helperIcon, helperText, color, ...other },
    ref,
  ) {
    const { density } = useEds()
    const actualVariant = color || 'input'
    const inputToken = tokens[actualVariant]
    const token = useToken({ density }, inputToken)

    const helperTextColor = useMemo(() => {
      const _token = token()
      return other.disabled
        ? _token.entities.helperText.states.disabled.typography.color
        : _token.entities.helperText.typography.color
    }, [token, other.disabled])

    return (
      <ThemeProvider theme={token}>
        <Container {...other} ref={ref}>
          <Label label={label} meta={meta} />
          {children}
          <HelperText
            icon={helperIcon}
            text={helperText}
            color={helperTextColor}
          ></HelperText>
        </Container>
      </ThemeProvider>
    )
  },
)
