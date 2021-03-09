import * as React from 'react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { useTextField } from './context'
import { Input } from '../Input'
import { Icon } from './Icon'
import type { Variants } from './types'
import styled from 'styled-components'
import { typographyTemplate } from '@utils'
import { textfield as tokens } from './TextField.tokens'

const InlineStuffWrapper = styled.div`
  display: flex;
  align-items: center;
  box-shadow: inset 0 -1px 0 0 #6f6f6f;
  background: #f7f7f7;
  padding-right: ${tokens.spacings.right};
`

const Unit = styled.span`
  ${typographyTemplate(tokens.entities.unit.typography)}
`

const UnitAndIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-left: ${tokens.spacings.left};
  & div:nth-child(2) {
    margin-left: ${tokens.spacings.left};
  }
`

type TextfieldInputProps = {
  /** Specifies if text should be bold */
  multiline?: boolean
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readonly?: boolean
  unit?: string
  inputIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export const InputWrapper = React.forwardRef<
  HTMLInputElement,
  TextfieldInputProps
>(function InputWrapper(
  { multiline, variant, disabled, type, unit, inputIcon, ...other },
  ref,
) {
  const { handleFocus, handleBlur, isFocused } = useTextField()

  console.log('is focused', isFocused)

  const inputProps = {
    multiline,
    ref,
    type,
    disabled,
    variant,
    ...other,
  }

  return (
    <>
      {(!multiline && inputIcon) || unit ? (
        <InlineStuffWrapper>
          <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
          <UnitAndIconWrapper>
            {unit && <Unit>{unit}</Unit>}
            {inputIcon && (
              <Icon isDisabled={disabled} variant={variant}>
                {inputIcon}
              </Icon>
            )}
          </UnitAndIconWrapper>
        </InlineStuffWrapper>
      ) : (
        <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
      )}
    </>
  )
})
