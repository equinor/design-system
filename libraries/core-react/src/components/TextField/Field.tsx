import { ReactNode, forwardRef, Ref } from 'react'
import { useTextField } from './TextField.context'
import { Input } from '../Input'
import { Icon } from './Icon'
import type { Variants } from './types'
import type { TextFieldToken } from './TextField.tokens'
import styled, { css } from 'styled-components'
import { typographyTemplate, outlineTemplate } from '../../utils'
import * as tokens from './TextField.tokens'
import { Textarea } from '../Textarea'
import { useEds } from './../EdsProvider'

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
  isReadOnly: boolean
  variant: string
  token: TextFieldToken
  inputIcon?: ReactNode
  unit?: string
  multiline?: boolean
}

export const InputWrapper = styled.div<InputWrapperType>(
  ({ inputIcon, unit, isDisabled, isReadOnly, multiline, variant }) => css`
    ${Variation}
    ${(inputIcon || unit) &&
    css`
      display: flex;
      align-items: center;
      background: ${textfield.background};
      padding-right: ${textfield.spacings.right};
    `}
    ${isReadOnly &&
    css`
      box-shadow: none;
      background: transparent;
    `}
    ${isDisabled &&
    css`
      box-shadow: none;
      cursor: not-allowed;
      outline: none;
    `}
    ${multiline &&
    variant === 'default' &&
    !inputIcon &&
    !unit &&
    css`
      box-shadow: none;
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
  ${({ multiline, theme }) =>
    multiline && {
      marginTop: theme.spacings.top,
      alignSelf: 'start',
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
  readOnly?: boolean
  /** Unit text */
  unit?: string
  /* Input icon */
  inputIcon?: ReactNode
  /** Specifies max rows for multiline input */
  rowsMax?: number
} & React.HTMLAttributes<HTMLTextAreaElement | HTMLInputElement>

export const Field = forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  FieldProps
>(function Field(
  {
    multiline,
    variant,
    disabled,
    readOnly,
    type,
    unit,
    inputIcon,
    rowsMax,
    onBlur,
    onFocus,
    ...other
  },
  ref,
) {
  const { handleFocus, handleBlur, isFocused } = useTextField()
  const { density } = useEds()
  const iconSize = density === 'compact' ? 16 : 24
  const actualVariant = variant === 'default' ? 'textfield' : variant
  const inputVariant = tokens[actualVariant]

  const focusHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleFocus()
    onFocus && onFocus(e)
  }

  const blurHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleBlur()
    onBlur && onBlur(e)
  }

  const inputWrapperProps = {
    isFocused,
    isDisabled: disabled,
    isReadOnly: readOnly,
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
    readOnly,
    variant,
    onBlur: blurHandler,
    onFocus: focusHandler,
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
        <StrippedTextarea {...textareaProps} />
      ) : (
        <StrippedInput {...inputProps} />
      )}
      {(inputIcon || unit) && (
        <Adornments multiline={multiline}>
          {unit && <Unit isDisabled={disabled}>{unit}</Unit>}
          {inputIcon && (
            <Icon isDisabled={disabled} variant={variant} size={iconSize}>
              {inputIcon}
            </Icon>
          )}
        </Adornments>
      )}
    </InputWrapper>
  )
})
