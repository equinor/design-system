import { InputHTMLAttributes, forwardRef, ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
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
import { ComponentToken } from '@equinor/eds-tokens'

const Container = styled.div(({ token, disabled, readOnly }: StyledProps) => {
  const { states, entities } = token

  return css`
    --eds-input-adornment-color: ${entities.adornment.typography.color};

    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto auto auto;
    column-gap: 8px;
    border: none;
    box-sizing: border-box;
    height: ${token.height};
    box-shadow: ${token.boxShadow};
    background: ${token.background};
    ${outlineTemplate(token.outline)}
    ${typographyTemplate(token.typography)}


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

const StyledInput = styled.input(({ token }: StyledProps) => {
  const {
    states: { disabled },
  } = token

  return css`
    width: 100%;
    border: none;
    background: transparent;
    ${spacingsTemplate(token.spacings)}
    ${typographyTemplate(token.typography)}
    outline: none;

    &::placeholder {
      color: ${token.entities.placeholder.typography.color};
    }

    &:disabled {
      color: ${disabled.typography.color};
      cursor: not-allowed;
    }
  `
})

type AdornmentProps = {
  token: InputToken
  width: string
  left?: number
  right?: number
}

export const Adornments = styled.div(
  ({ token, width, left, right }: AdornmentProps) => {
    return css`
      top: 0;
      bottom: 0;
      left: ${left};
      right: ${right};
      width: ${width}px;
      display: flex;
      column-gap: 8px;
      justify-content: center;
      align-items: center;
      ${typographyTemplate(token.entities.adornment.typography)}
      color: var(--eds-input-adornment-color);
    `
  },
)

type StyledProps = {
  token: InputToken
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
  /** Left adornments width */
  leftAdornmentsWidth?: number
  /** Right adornments */
  rightAdornments?: ReactNode
  /** Right adornments width */
  rightAdornmentsWidth?: number
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'default',
    disabled = false,
    type = 'text',
    leftAdornments,
    rightAdornments,
    leftAdornmentsWidth,
    rightAdornmentsWidth,
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
  const token = useToken({ density }, inputVariant)()

  const updatedToken = useMemo(
    (): ComponentToken => ({
      ...token,
      // spacings: {
      //   left:
      //     typeof leftAdornmentsWidth !== 'undefined'
      //       ? `${leftAdornmentsWidth}px`
      //       : token.spacings.left,
      //   right:
      //     typeof rightAdornmentsWidth !== 'undefined'
      //       ? `${rightAdornmentsWidth}px`
      //       : token.spacings.right,
      // },
    }),
    [leftAdornmentsWidth, rightAdornmentsWidth, token],
  )
  const inputProps = {
    ref,
    type,
    disabled,
    readOnly,
    token: updatedToken,
    leftAdornmentsWidth,
    rightAdornmentsWidth,
    ...other,
  }

  const containerProps = {
    disabled,
    readOnly,
    className,
    style,
    token: updatedToken,
  }

  const leftAdornmentProps = {
    token: updatedToken,
    width: leftAdornmentsWidth,
    left: 0,
  }
  const rightAdornmentProps = {
    token: updatedToken,
    width: rightAdornmentsWidth,
    right: 0,
  }

  return (
    // Not using <ThemeProvider> because of cascading styling messing with adornments
    <Container {...containerProps}>
      {leftAdornments ? (
        <Adornments {...leftAdornmentProps}>{leftAdornments}</Adornments>
      ) : null}
      <StyledInput {...inputProps} />
      {rightAdornments ? (
        <Adornments {...rightAdornmentProps}>{rightAdornments}</Adornments>
      ) : null}
    </Container>
  )
})
