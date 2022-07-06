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

const Container = styled.div(({ theme, disabled, readOnly }: StyledProps) => {
  const { states, entities } = theme

  return css`
    --eds-input-adornment-color: ${entities.adornment.typography.color};

    display: flex;
    flex-direction: row;
    column-gap: 8px;
    border: none;
    box-sizing: border-box;
    height: ${theme.height};
    box-shadow: ${theme.boxShadow};
    background: ${theme.background};
    ${outlineTemplate(theme.outline)}
    ${spacingsTemplate(theme.spacings)}
    ${typographyTemplate(theme.typography)}


    &:focus-within {
      --eds-input-adornment-color: ${entities.adornment?.states.focus?.outline
        .color};

      box-shadow: none;
      ${outlineTemplate(states.focus.outline)}
    }

    ${disabled &&
    css`
      --eds-input-adornment-color: ${states.disabled.typography.color};
      color: ${states.disabled.typography.color};
      cursor: not-allowed;
      box-shadow: none;
      outline: none;
      &:focus-within {
        outline: none;
      }
    `}
    ${readOnly &&
    css({
      background: states.readOnly.background,
      boxShadow: states.readOnly.boxShadow,
    })}
  `
})

const StyledInput = styled.input(({ theme }: StyledProps) => {
  const {
    states: { disabled },
  } = theme

  return css`
    width: 100%;
    border: none;
    background: transparent;
    ${typographyTemplate(theme.typography)}
    outline: none;

    &::placeholder {
      color: ${theme.entities.placeholder.typography.color};
    }

    &:disabled {
      color: ${disabled.typography.color};
      cursor: not-allowed;
    }
  `
})

export const Adornments = styled.div(({ theme }: StyledProps) => {
  return css`
    display: flex;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
    width: fit-content;
    ${typographyTemplate(theme.entities.adornment.typography)}
    color: var(--eds-input-adornment-color);
  `
})

type StyledProps = {
  theme: InputToken
} & Required<Pick<InputProps, 'readOnly' | 'disabled'>>

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
    readOnly,
    className,
    style,
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
    readOnly,
    ...other,
  }

  const containerProps = {
    disabled,
    readOnly,
    className,
    style,
  }

  const adornmentProps = {
    disabled,
    readOnly,
  }

  return (
    <ThemeProvider theme={token}>
      <Container {...containerProps}>
        {leftAdornments ? (
          <Adornments {...adornmentProps}>{leftAdornments}</Adornments>
        ) : null}
        <StyledInput {...inputProps} />
        {rightAdornments ? (
          <Adornments {...adornmentProps}>{rightAdornments}</Adornments>
        ) : null}
      </Container>
    </ThemeProvider>
  )
})
