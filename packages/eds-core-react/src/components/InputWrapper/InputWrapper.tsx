import { HTMLAttributes, forwardRef, ReactElement, ReactNode } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { Label } from '../Label'
import { HelperText } from './HelperText'
import { useEds } from './../EdsProvider'
import { inputToken } from './InputWrapper.tokens'
import { useToken } from '@equinor/eds-utils'

const Container = styled.div``

const WrapperHelperText = styled(HelperText)`
  margin-top: 8px;
  margin-left: 8px;
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
} & HTMLAttributes<HTMLDivElement>

export const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(
  function InputWrapper(
    { label, meta, children, helperIcon, helperText, ...other },
    ref,
  ) {
    const { density } = useEds()
    const token = useToken({ density }, inputToken.input)

    return (
      <ThemeProvider theme={token}>
        <Container {...other} ref={ref}>
          <Label label={label} meta={meta} />
          {children}
          <WrapperHelperText
            icon={helperIcon}
            text={helperText}
          ></WrapperHelperText>
        </Container>
      </ThemeProvider>
    )
  },
)
