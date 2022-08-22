import {
  InputHTMLAttributes,
  forwardRef,
  ReactNode,
  ForwardedRef,
  useCallback,
} from 'react'
import styled, { css } from 'styled-components'
import { ComponentToken } from '@equinor/eds-tokens'
import {
  typographyMixin,
  spacingsTemplate,
  outlineTemplate,
  useToken,
} from '@equinor/eds-utils'
import { inputToken as tokens } from './Input.tokens'
import type { InputToken } from './Input.tokens'
import type { Variants } from '../TextField/types'
import { useEds } from '../EdsProvider'

const Container = styled.div(({ token, disabled, readOnly }: StyledProps) => {
  const { states, entities } = token

  return css`
    --eds-input-adornment-color: ${entities.adornment.typography.color};
    --eds-input-color: ${token.typography.color};

    position: relative;
    width: ${token.width};
    display: flex;
    flex-direction: row;
    border: none;
    box-sizing: border-box;
    height: ${token.height};
    box-shadow: ${token.boxShadow};
    background: ${token.background};
    ${outlineTemplate(token.outline)}

    &:focus-within {
      --eds-input-adornment-color: ${entities.adornment?.states.focus?.outline
        .color};

      box-shadow: none;
      ${outlineTemplate(states.focus.outline)}
    }

    ${disabled &&
    css`
      --eds-input-adornment-color: ${states.disabled.typography.color};
      --eds-input-color: ${states.disabled.typography.color};
      cursor: not-allowed;
      box-shadow: none;
    `}
    ${readOnly &&
    css({
      background: states.readOnly.background,
      boxShadow: states.readOnly.boxShadow,
    })}
  `
})

const StyledInput = styled.input(({ token }: StyledProps) => {
  return css`
    width: 100%;
    border: none;
    background: transparent;
    ${spacingsTemplate(token.spacings)}
    ${typographyMixin(token.typography)}
    outline: none;

    &::placeholder {
      color: ${token.entities.placeholder.typography.color};
    }

    &:disabled {
      color: var(--eds-input-color);
      cursor: not-allowed;
    }
  `
})

type AdornmentProps = {
  token: InputToken
}

const Adornments = styled.div<AdornmentProps>(({ token }) => {
  return css`
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    ${typographyMixin(token.entities.adornment.typography)}
    color: var(--eds-input-adornment-color);
  `
})

const LeftAdornments = styled(Adornments)(
  ({ token }) => css`
    left: 0;
    padding-left: ${token.entities.adornment.spacings.left};
  `,
)

const RightAdornments = styled(Adornments)(
  ({ token }) => css`
    right: 0;
    padding-right: ${token.entities.adornment.spacings.right};
  `,
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
  /** Right adornments ref */
  rightAdornmentsRef?: ForwardedRef<HTMLDivElement>
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant,
    disabled = false,
    type = 'text',
    leftAdornments,
    rightAdornments,
    leftAdornmentsWidth,
    rightAdornmentsWidth,
    rightAdornmentsRef,
    readOnly,
    className,
    style,
    ...other
  },
  ref,
) {
  const inputVariant = tokens[variant] ? tokens[variant] : tokens.input
  const { density } = useEds()
  const token = useToken({ density }, inputVariant)()
  const updatedToken = useCallback(
    (): ComponentToken => ({
      ...token,
      spacings: {
        ...token.spacings,
        left:
          typeof leftAdornmentsWidth !== 'undefined'
            ? `${leftAdornmentsWidth}px`
            : token.spacings.left,
        right:
          typeof rightAdornmentsWidth !== 'undefined'
            ? `${rightAdornmentsWidth}px`
            : token.spacings.right,
      },
    }),
    [leftAdornmentsWidth, rightAdornmentsWidth, token],
  )()

  const inputProps = {
    ref,
    type,
    disabled,
    readOnly,
    token: updatedToken,
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
  }
  const rightAdornmentProps = {
    ref: rightAdornmentsRef,
    token: updatedToken,
  }

  return (
    // Not using <ThemeProvider> because of cascading styling messing with adornments
    <Container {...containerProps}>
      {leftAdornments ? (
        <LeftAdornments {...leftAdornmentProps}>
          {leftAdornments}
        </LeftAdornments>
      ) : null}
      <StyledInput {...inputProps} />
      {rightAdornments ? (
        <RightAdornments {...rightAdornmentProps}>
          {rightAdornments}
        </RightAdornments>
      ) : null}
    </Container>
  )
})
