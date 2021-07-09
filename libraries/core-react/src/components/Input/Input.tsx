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

const { input } = tokens

const Variation = ({ variant, theme }: StyledProps) => {
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
    border: none;
    ${outlineTemplate(activeOutline)}
    height: ${theme.minHeight};
    ${spacingsTemplate(theme.spacings)};
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
  variant: string
  theme: InputToken
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

const InputBase = styled.input(
  ({ theme }: { theme: InputToken }) =>
    css`
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      border: none;
      appearance: none;
      background: ${theme.background};

      ${typographyTemplate(theme.typography)}

      ${Variation}
    &::placeholder {
        color: ${theme.entities.placeholder.typography.color};
      }
      &:disabled {
        color: ${theme.states.disabled.typography.color};
      }
    `,
)

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
  const inputVariant = tokens[actualVariant] as InputToken
  const { density } = useEds()
  const token = useToken({ density }, inputVariant)()

  const inputProps = {
    ref,
    type,
    disabled,
    variant,
    token: inputVariant,
    density,
    ...other,
  }

  return (
    <ThemeProvider theme={token}>
      <StyledInput {...inputProps} />
    </ThemeProvider>
  )
})
