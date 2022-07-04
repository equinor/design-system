import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { inputToken as tokens } from './Input.tokens'
import type { InputToken } from './Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  outlineTemplate,
  useToken,
} from '@equinor/eds-utils'
import type { Variants } from '../TextField/types'
import { useEds } from '../EdsProvider'

const Container = styled.div(({ theme }) => {
  const {
    states: {
      focus: { outline: focusOutline },
      disabled,
      readOnly,
    },
    outline,
  } = theme

  return css`
    display: flex;
    flex-direction: row;
    column-gap: 8px;
    box-sizing: border-box;
    border: none;
    background: ${theme.background};
    height: ${theme.minHeight};
    box-shadow: ${theme.boxShadow};
    ${outlineTemplate(theme.outline)}
    ${spacingsTemplate(theme.spacings)}

    &:active,
    &:focus-within {
      outline-offset: 0;
      box-shadow: none;
      ${outlineTemplate(focusOutline)}
    }
  `
})

const StyledInput = styled.input(({ theme }: StyledProps) => {
  const {
    states: {
      focus: { outline: focusOutline },
      disabled,
      readOnly,
    },
    outline,
  } = theme

  return css`
    width: 100%;
    border: none;
    background: transparent;

    ${typographyTemplate(theme.typography)}

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${theme.entities.placeholder.typography.color};
    }

    &:disabled {
      color: ${disabled.typography.color};
      cursor: not-allowed;
      box-shadow: none;
      outline: none;
      &:focus,
      &:active {
        outline: none;
      }
    }
    &[readOnly] {
      background: ${readOnly.background};
      box-shadow: ${readOnly.boxShadow};
    }
  `
})

export const Adornments = styled.div(({ theme }) => {
  return css`
    display: flex;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
    width: fit-content;
    ${typographyTemplate(theme.entities.adornment.typography)}
  `
})

type StyledProps = {
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
  readOnly?: boolean
  /** Left adornments */
  leftAdornments?: ReactNode
  /** Right adornments */
  rightAdornments?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'default',
    disabled = false,
    type = 'text',
    leftAdornments,
    rightAdornments,
    ...other
  },
  ref,
) {
  const actualVariant = variant === 'default' ? 'input' : variant
  const inputVariant = tokens[actualVariant]
  const { density } = useEds()
  const token = useToken({ density }, inputVariant)

  const inputProps = {
    ref,
    type,
    disabled,
    ...other,
  }

  return (
    <ThemeProvider theme={token}>
      <Container>
        <Adornments>{leftAdornments}</Adornments>
        <StyledInput {...inputProps} />
        <Adornments>{rightAdornments}</Adornments>
      </Container>
    </ThemeProvider>
  )
})
