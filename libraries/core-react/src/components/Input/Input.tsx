import { ElementType, InputHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import * as tokens from './Input.tokens'
import type { InputToken } from './Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../utils'
import type { Variants } from '../TextField/types'
import type { Spacing } from '@equinor/eds-tokens'

const { input, baseInput } = tokens

const Variation = ({
  variant,
  token,
}: {
  variant: string
  token: InputToken
}) => {
  if (!variant) {
    return ``
  }

  const {
    states: {
      focus: { outline: focusOutline },
      active: { outline: activeOutline },
    },
    boxShadow,
  } = token

  return css`
    border: none;
    ${outlineTemplate(activeOutline)}
    box-shadow: ${boxShadow};

    &:active,
    &:focus {
      outline-offset: 0;
      box-shadow: none;
      ${outlineTemplate(focusOutline)}
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
  token: InputToken
  variant: string
}

const StyledInput = styled.input<StyledProps>`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;
  background: ${baseInput.background};

  ${({ spacings }) => spacingsTemplate(spacings)}
  ${typographyTemplate(baseInput.typography)}

  ${Variation}
  &::placeholder {
    color: ${baseInput.entities.placeholder.typography.color};
  }
  &:disabled {
    color: ${baseInput.states.disabled.typography.color};
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

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
  const inputVariant = input[variant]
  const spacings = tokens.comfortable.spacings

  const inputProps = {
    as,
    ref,
    type,
    disabled,
    variant,
    token: inputVariant,
    spacings,
    ...other,
  }

  return <StyledInput {...inputProps} />
})
