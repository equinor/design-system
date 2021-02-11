import * as React from 'react'
import { ReactNode, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { useTextField } from '../context'
import { Icon } from '../Icon'
import { Input } from '../../Input'
import type { Variants } from '../types'

const Container = styled.div`
  position: relative;
`
const PaddedInput = styled(Input)`
  padding-right: 32px;
`

type TextfieldInputProps = {
  /** Specifies if text should be bold */
  multiline?: boolean
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Icon to be embeded in input field */
  inputIcon?: ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readonly?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const TextFieldInput = React.forwardRef<
  HTMLInputElement,
  TextfieldInputProps
>(function TextFieldInput(
  { multiline, variant, inputIcon, disabled, type, ...other },
  ref,
) {
  const { handleFocus, handleBlur } = useTextField()

  const inputProps = {
    multiline,
    ref,
    type,
    disabled,
    variant,
    ...other,
  }

  return (
    <Container>
      {inputIcon ? (
        <>
          <PaddedInput
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...inputProps}
          />
          <Icon isDisabled={disabled} variant={variant} inputIcon>
            {inputIcon}
          </Icon>
        </>
      ) : (
        <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
      )}
    </Container>
  )
})

// Input.displayName = 'eds-text-field-input'
