import { InputHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import * as tokens from './Input.tokens'
import type { InputToken } from './Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../utils'
import type { Variants } from '../TextField/types'
import { useEds } from '../EdsProvider'

const { input, inputVariants } = tokens

const Variation = ({ variant, token, density }: StyledProps) => {
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

  let spacings = input.spacings
  let height = input.minHeight
  if (density === 'compact') {
    spacings = input.modes.compact.spacings
    height = input.modes.compact.minHeight
  }

  return css`
    height: ${height};
    border: none;
    ${outlineTemplate(activeOutline)}
    ${spacingsTemplate(spacings)}

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
  density: string
  token: InputToken
  variant: string
}

const StyledInput = styled.input<StyledProps>`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;
  background: ${input.background};

  ${typographyTemplate(input.typography)}

  ${Variation}
  &::placeholder {
    color: ${input.entities.placeholder.typography.color};
  }
  &:disabled {
    color: ${input.states.disabled.typography.color};
  }
`

export type InputProps = {
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
  { variant = 'default', disabled = false, type = 'text', ...other },
  ref,
) {
  const inputVariant = inputVariants[variant]
  const { density } = useEds()

  const inputProps = {
    ref,
    type,
    disabled,
    variant,
    token: inputVariant,
    density,
    ...other,
  }

  return <StyledInput {...inputProps} />
})
