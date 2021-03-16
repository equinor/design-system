import * as React from 'react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { useTextField } from './context'
import { Input } from '../Input'
import { Icon } from './Icon'
import type { Variants } from './types'
import type { TextFieldToken } from './TextField.tokens'
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
  token: TextFieldToken
  isFocused: boolean
}) => {
  if (!variant) {
    return ``
  }

  return css`
    box-shadow: ${isFocused
      ? `none`
      : variant === 'default'
      ? `inset 0 -1px 0 0 ${
          token.border?.type === 'border' && token.border?.color
        }`
      : `0 0 0 1px ${token.border?.type === 'border' && token.border?.color}`};
    ${isFocused && outlineTemplate(token.states.focus.outline)}
  `
}

const StyledInput = styled(Input)`
  outline: none;

  &:active,
  &:focus {
    outline: none;
    box-shadow: none;
  }
`

type InputWithAdornmentsType = {
  isFocused: boolean
  isDisabled: boolean
  variant: string
  token: TextFieldToken
}

export const InputWithAdornments = styled.div<InputWithAdornmentsType>`
  display: flex;
  align-items: center;
  ${{
    background: textfield.background,
    paddingRight: textfield.spacings.right,
  }}
  ${Variation}
  ${({ isDisabled }) =>
    isDisabled && {
      boxShadow: 'none',
      cursor: 'not-allowed',
      outline: 'none',
    }}
`

type UnitType = {
  isDisabled: boolean
}

const Unit = styled.span<UnitType>`
  ${typographyTemplate(textfield.entities.unit.typography)};
  /*   Yes, we don't like magic numbers, but if you have both unit and icon, 
  the unit is slightly off due to line-height and font */
  display: inline-block;
  margin-top: 3px;
  ${({ isDisabled }) =>
    isDisabled && {
      color: textfield.entities.unit.states.disabled.typography.color,
    }}
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

type InputWrapperProps = {
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
  /** Unit text */
  unit?: string
  /* Input icon */
  inputIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export const InputWrapper = React.forwardRef<
  HTMLInputElement,
  InputWrapperProps
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
          <StyledInput
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...inputProps}
          />
          <Adornments multiline={multiline}>
            {unit && <Unit isDisabled={disabled}>{unit}</Unit>}
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
