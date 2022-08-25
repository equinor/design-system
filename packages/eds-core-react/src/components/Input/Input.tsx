import {
  InputHTMLAttributes,
  forwardRef,
  ReactNode,
  useState,
  useCallback,
} from 'react'
import styled, { css } from 'styled-components'
import { ComponentToken } from '@equinor/eds-tokens'
import {
  typographyMixin,
  spacingsTemplate,
  outlineTemplate,
  useToken,
  OverridableComponent,
} from '@equinor/eds-utils'
import { inputToken as tokens } from './Input.tokens'
import type { InputToken } from './Input.tokens'
import type { Variants } from '../types'
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
  /** Right adornments */
  rightAdornments?: ReactNode
  /** Cast the input to another element */
  as?: 'input' | 'textarea'
} & InputHTMLAttributes<HTMLInputElement>

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<HTMLInputElement, InputProps>(function Input(
    {
      variant,
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
    const inputVariant = tokens[variant] ? tokens[variant] : tokens.input
    const { density } = useEds()
    const token = useToken({ density }, inputVariant)()

    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()
    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()

    const rightAdornmentsWidth = useCallback(() => {
      if (rightAdornmentsRef) {
        return rightAdornmentsRef.offsetWidth
      }
      return 0
    }, [rightAdornmentsRef])()

    const leftAdornmentsWidth = useCallback(() => {
      if (leftAdornmentsRef) {
        return leftAdornmentsRef.offsetWidth
      }
      return 0
    }, [leftAdornmentsRef])()

    const updatedToken = useCallback(
      (): ComponentToken => ({
        ...token,
        spacings: {
          ...token.spacings,
          left: `${leftAdornmentsWidth + parseInt(token.spacings.left)}px`,
          right: `${rightAdornmentsWidth + parseInt(token.spacings.right)}px`,
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
      style: {
        resize: style?.resize,
      },
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
      ref: setLeftAdornmentsRef,
      token: updatedToken,
    }
    const rightAdornmentProps = {
      ref: setRightAdornmentsRef,
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
