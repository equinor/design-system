import * as React from 'react'
import { ElementType, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { InputVariantProps, input as tokens } from './Input.tokens'
import { typographyTemplate, spacingsTemplate } from '@utils'
import type { Variants } from '../TextField/types'
import type { Spacing } from '@equinor/eds-tokens'

const Variation = ({ variant }: { variant: InputVariantProps }) => {
  if (!variant) {
    return ``
  }

  const {
    focus: { border: focusBorderOutline },
    border: { outline: borderOutline, bottom: borderBottom },
  } = variant

  return css`
    border: none;
    outline: ${borderOutline.width} solid ${borderOutline.color};
    box-shadow: inset 0 -${borderBottom.width} 0 0 ${borderBottom.color};
    &:active,
    &:focus {
      outline-offset: 0;
      box-shadow: none;
      outline: ${focusBorderOutline.width} solid ${focusBorderOutline.color};
    }

    &:disabled {
      cursor: not-allowed;
      box-shadow: none;
      outline: none;

      &:focus,
      &:active {
        outline: none;
      }
    }
  `
}

type StyledProps = {
  spacings: Spacing
  variant: InputVariantProps
}

const StyledInput = styled.input<StyledProps>`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;

  background: ${tokens.background};

  ${({ spacings }) => spacingsTemplate(spacings)}
  ${typographyTemplate(tokens.typography)}

  ${Variation}
  &::placeholder {
    color: ${tokens.placeholderColor};
  }
`

export type InputProps = {
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
} & InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      multiline = false,
      variant = 'default',
      disabled = false,
      type = 'text',
      ...other
    },
    ref,
  ) {
    const as: ElementType = multiline ? 'textarea' : 'input'
    const inputVariant = tokens[variant]
    const spacings = tokens.spacings.comfortable

    const inputProps = {
      as,
      ref,
      type,
      disabled,
      variant: inputVariant,
      spacings: spacings,
      ...other,
    }

    return <StyledInput {...inputProps} />
  },
)
