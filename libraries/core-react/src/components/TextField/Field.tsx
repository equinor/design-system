import { ReactNode, forwardRef, Ref } from 'react'
import { useTextField } from './context'
import { Input } from '../Input'
import { input as inputToken } from '../Input/Input.tokens'
import { Icon } from './Icon'
import type { Variants } from './types'
import type { TextFieldToken } from './TextField.tokens'
import styled, { css } from 'styled-components'
import { typographyTemplate, outlineTemplate } from '../../utils'
import * as tokens from './TextField.tokens'
import { Textarea } from '../Textarea'
import { useEds } from '../EdsProvider'

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

const StrippedInput = styled(Input)`
  outline: none;

  &:active,
  &:focus {
    outline: none;
    box-shadow: none;
  }
`

const StrippedTextarea = styled(Textarea)`
  outline: none;

  &:active,
  &:focus {
    outline: none;
    box-shadow: none;
  }
`

type InputWrapperType = {
  isFocused: boolean
  isDisabled: boolean
  variant: string
  token: TextFieldToken
  inputIcon?: ReactNode
  unit?: string
  multiline?: boolean
}

export const InputWrapper = styled.div<InputWrapperType>(
  ({ inputIcon, unit, isDisabled, multiline, variant }) => css`
    ${Variation}
    ${(inputIcon || unit) &&
    css`
      display: flex;
      align-items: center;
      background: ${textfield.background};
      padding-right: ${textfield.spacings.right};
    `}

    ${isDisabled &&
    css`
      box-shadow: 'none';
      cursor: 'not-allowed';
      outline: 'none';
    `} 
    ${multiline &&
    variant === 'default' &&
    !inputIcon &&
    !unit &&
    css`
      box-shadow: 'none';
    `}
  `,
)

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
  density: string
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
  ${({ multiline, density }) =>
    multiline && {
      alignSelf: 'start',
      marginTop:
        density === 'compact'
          ? inputToken.modes.compact.spacings.top
          : textfield.spacings.top,
    }}
`

type FieldProps = {
  /** Specifies if input should be multiline*/
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
  /** Specifies max rows for multiline input */
  rowsMax?: number
}

export const Field = forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  FieldProps
>(function Field(
  { multiline, variant, disabled, type, unit, inputIcon, rowsMax, ...other },
  ref,
) {
  const { handleFocus, handleBlur, isFocused } = useTextField()
  const { density } = useEds()

  const actualVariant = variant === 'default' ? 'textfield' : variant
  const inputVariant = tokens[actualVariant]

  const inputWrapperProps = {
    isFocused,
    isDisabled: disabled,
    variant,
    token: inputVariant,
    inputIcon,
    unit,
    multiline,
  }

  const inputProps = {
    ref: ref as Ref<HTMLInputElement>,
    type,
    disabled,
    variant,
    ...other,
  }

  const textareaProps = {
    ...inputProps,
    rowsMax,
    ref: ref as Ref<HTMLTextAreaElement>,
  }

  return (
    <InputWrapper {...inputWrapperProps}>
      {multiline ? (
        <StrippedTextarea
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...textareaProps}
        />
      ) : (
        <StrippedInput
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...inputProps}
        />
      )}
      {(inputIcon || unit) && (
        <Adornments multiline={multiline} density={density}>
          {unit && <Unit isDisabled={disabled}>{unit}</Unit>}
          {inputIcon && (
            <Icon isDisabled={disabled} variant={variant}>
              {inputIcon}
            </Icon>
          )}
        </Adornments>
      )}
    </InputWrapper>
  )
})
