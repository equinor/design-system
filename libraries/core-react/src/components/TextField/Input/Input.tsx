import * as React from 'react'
import { ReactNode, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { input as tokens } from './Input.tokens'
import { useTextField } from '../context'
import { Icon } from '../Icon'
import { Input } from '../../Input'
import type { Variants } from '../types'
import type { Spacing } from '@equinor/eds-tokens'

const Container = styled.div`
  position: relative;
`

type StyledIconProps = {
  spacings: Spacing
}

export const PaddedInput = styled(Input)`
  /* Hack: Had to add + 0px to satisfy the style lint plugin */
`

const StyledIcon = styled(Icon)<StyledIconProps>`
  position: absolute;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};
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

  const inputVariant = tokens[variant]
  const spacings = tokens.spacings.comfortable

  const iconProps = {
    spacings: spacings,
    isDisabled: disabled,
    color: inputVariant.icon.color,
    disabledColor: inputVariant.icon.disabledColor,
    focusColor: inputVariant.icon.focus.color,
  }

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
      <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
      {inputIcon && <StyledIcon {...iconProps}>{inputIcon}</StyledIcon>}
    </Container>
  )
})

// Input.displayName = 'eds-text-field-input'
