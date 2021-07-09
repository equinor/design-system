import { InputHTMLAttributes, forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import * as tokens from './Input.tokens'
import type { InputToken } from './Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../utils'
import type { Variants } from '../TextField/types'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const StyledInput = styled.input(({ variant, theme }: StyledProps) => {
  if (!variant) {
    return ``
  }

  const {
    states: {
      focus: { outline: focusOutline },
      active: { outline: activeOutline },
    },
    boxShadow,
  } = theme

  return css`
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    appearance: none;
    background: ${theme.background};
    border: none;
    height: ${theme.minHeight};
    box-shadow: ${boxShadow};

    ${outlineTemplate(activeOutline)}
    ${typographyTemplate(theme.typography)}
    ${spacingsTemplate(theme.spacings)};

    &::placeholder {
      color: ${theme.entities.placeholder.typography.color};
    }

    &:active,
    &:focus {
      outline-offset: 0;
      box-shadow: none;
      ${outlineTemplate(focusOutline)}
    }

    &:disabled {
      color: ${theme.states.disabled.typography.color};
      cursor: not-allowed;
      box-shadow: none;
      outline: none;
      &:focus,
      &:active {
        outline: none;
      }
    }
  `
})

type StyledProps = {
  variant: string
  theme: InputToken
}

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
  const actualVariant = variant === 'default' ? 'input' : variant
  const inputVariant = tokens[actualVariant]
  const { density } = useEds()
  const token = useToken({ density }, inputVariant)()

  const inputProps = {
    ref,
    type,
    disabled,
    variant,
    ...other,
  }

  return (
    <ThemeProvider theme={token}>
      <StyledInput {...inputProps} />
    </ThemeProvider>
  )
})
