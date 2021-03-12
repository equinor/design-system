import * as React from 'react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { useTextField } from './context'
import { Input } from '../Input'
import { Icon } from './Icon'
import type { Variants } from './types'
import type { Outline, ComponentToken } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'
import { typographyTemplate, outlineTemplate } from '@utils'
import * as tokens from './TextField.tokens'

const { textfield, error } = tokens

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
  console.log('isFocused ----------', isFocused)
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
    outline: ${() =>
      isFocused
        ? `${token.states.focus.outline.width} solid ${token.states.focus.outline.color}`
        : 'none'};
  `
}

type InlineStuffWrapperType = {
  isFocused: boolean
  isDisabled: boolean
  variant: string
  token: ComponentToken
}

type UnitAndIconWrapper = {
  multiline: boolean
}
export const InlineStuffWrapper = styled.div<InlineStuffWrapperType>`
  display: flex;
  align-items: center;

  background: #f7f7f7;
  padding-right: ${textfield.spacings.right};
  ${Variation}
  ${({ isDisabled }) =>
    isDisabled && {
      /* outlineTemplate(states.focus.outline) */
      boxShadow: 'none',
      cursor: 'not-allowed',
      outline: 'none',
    }}
`

const Unit = styled.span`
  ${typographyTemplate(textfield.entities.unit.typography)}
`

const UnitAndIconWrapper = styled.div<UnitAndIconWrapper>`
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
      /* outlineTemplate(states.focus.outline) */
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

  console.log('is focused', isFocused)

  const variantzz = variant === 'default' ? 'textfield' : variant
  const inputVariant = tokens[variantzz]
  console.log('variant', variant, inputVariant)
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
        <InlineStuffWrapper
          isFocused={isFocused}
          isDisabled={disabled}
          variant={variant}
          token={inputVariant}
        >
          <Input
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...inputProps}
            handleFocus={false}
          />
          <UnitAndIconWrapper multiline={multiline}>
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
