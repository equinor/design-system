import { HTMLAttributes, forwardRef, useMemo, ReactNode } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useToken } from '@equinor/eds-utils'
import { Label as _Label, LabelProps } from '../Label'
import { HelperText as _HelperText, HelperTextProps } from './HelperText'
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
  /** Disabled state */
  disabled?: boolean
  /** Read Only */
  readOnly?: boolean
  /** Highlight color */
  color?: 'error' | 'warning' | 'success'
  /** Label props */
  labelProps: LabelProps
  /** Helpertext props */
  helperProps?: HelperTextProps
  /** Input or Textarea elements */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

/** InputWrapper is a internal skeleton component for structering form elements  */
export const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(
  function InputWrapper(
    { children, color, label, labelProps = {}, helperProps = {}, ...other },
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

    const hasHelperText = Boolean(helperProps.text)
    const hasLabel = Boolean(label || labelProps.label)

    return (
      <ThemeProvider theme={token}>
        <Container {...other} ref={ref}>
          {hasLabel && <Label label={label} {...{ label, ...labelProps }} />}
          {children}
          {hasHelperText && (
            <HelperText color={helperTextColor} {...helperProps}></HelperText>
          )}
        </Container>
      </ThemeProvider>
    )
  },
)
