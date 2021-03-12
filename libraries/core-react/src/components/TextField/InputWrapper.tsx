import * as React from 'react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { useTextField } from './context'
import { Input } from '../Input'
import { Icon } from './Icon'
import type { Variants } from './types'
import type { ComponentToken } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'
import { typographyTemplate, outlineTemplate } from '@utils'
import * as tokens from './TextField.tokens'

const { textfield } = tokens

const Variation = ({
  variant,
  isFocused,
  token,
}: {
  variant: string
  token: ComponentToken
  isFocused: boolean
}) => {
  if (!variant) {
    return ``
  }

  return css`
    box-shadow: ${() =>
      isFocused
        ? `none`
        : variant === 'default'
        ? `inset 0 -1px 0 0 ${
            token.border?.type === 'border' && token.border?.color
          }`
        : `0 0 0 1px ${
            token.border?.type === 'border' && token.border?.color
          }`};
    ${isFocused && outlineTemplate(token.states.focus.outline)}
  `
}

type InputWithAdornmentsType = {
  isFocused: boolean
  isDisabled: boolean
  variant: string
  token: ComponentToken
}

export const InputWithAdornments = styled.div<InputWithAdornmentsType>`
  display: flex;
  align-items: center;
  background: ${textfield.background};
  padding-right: ${textfield.spacings.right};
  ${Variation}
  ${({ isDisabled }) =>
    isDisabled && {
      boxShadow: 'none',
      cursor: 'not-allowed',
      outline: 'none',
    }}
`

const Unit = styled.span`
  ${typographyTemplate(textfield.entities.unit.typography)};
  /*   Yes, we don't like magic numbers, but if you have both unit and icon, 
  the unit is slightly off due to line-height and font */
  display: inline-block;
  margin-top: 3px;
`

type AdornmentsType = {
  multiline: boolean
}

const Adornments = styled.div<AdornmentsType>`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  margin-left: ${textfield.spacings.left};
  & div:nth-child(2) {
    margin-left: ${textfield.spacings.left};
  }
  ${({ multiline }) =>
    multiline && {
      alignSelf: 'start',
      marginTop: `${textfield.spacings.top}`,
    }}
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

  const actualVariant = variant === 'default' ? 'textfield' : variant
  const inputVariant = tokens[actualVariant]
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
      {inputIcon || unit ? (
        <InputWithAdornments
          isFocused={isFocused}
          isDisabled={disabled}
          variant={variant}
          token={inputVariant}
        >
          <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
          <Adornments multiline={multiline}>
            {unit && <Unit>{unit}</Unit>}
            {inputIcon && (
              <Icon isDisabled={disabled} variant={variant}>
                {inputIcon}
              </Icon>
            )}
          </Adornments>
        </InputWithAdornments>
      ) : (
        <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
      )}
    </>
  )
})
