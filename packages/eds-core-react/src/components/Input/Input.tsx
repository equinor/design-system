import {
  forwardRef,
  ReactNode,
  useState,
  useCallback,
  CSSProperties,
  ElementType,
  ComponentPropsWithoutRef,
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

const StyledInput = styled.input(
  ({ token, paddingLeft, paddingRight }: StyledProps) => {
    return css`
      width: 100%;
      border: none;
      background: transparent;
      ${spacingsTemplate(token.spacings)}
      ${typographyMixin(token.typography)}
      outline: none;

      padding-left: ${paddingLeft};
      padding-right: ${paddingRight};

      &::placeholder {
        color: ${token.entities.placeholder.typography.color};
      }

      &:disabled {
        color: var(--eds-input-color);
        cursor: not-allowed;
      }
    `
  },
)

type AdornmentProps = {
  token: InputToken
  position?: 'left' | 'right'
}

const Adornments = styled.div<AdornmentProps>(
  ({ token, position = 'right' }) => {
    return css`
      position: absolute;
      top: ${token.spacings.top};
      bottom: ${token.spacings.bottom};
      display: flex;
      align-items: center;
      ${typographyMixin(token.entities.adornment.typography)}
      color: var(--eds-input-adornment-color);

      ${() => {
        if (position === 'left') {
          return css`
            left: 0;
            padding-left: ${token.entities.adornment.spacings.left};
          `
        }
        return css`
          right: 0;
          padding-right: ${token.entities.adornment.spacings.right};
        `
      }}
    `
  },
)

type StyledProps = {
  token: InputToken
  paddingLeft?: string
  paddingRight?: string
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
  /** Left adornments props */
  leftAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Right adornments props */
  rightAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Cast the input to another element */
  as?: ElementType
  /**  */
  className?: string
  style?: CSSProperties
}

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
      leftAdornmentsProps,
      rightAdornmentsProps,
      ...other
    },
    ref,
  ) {
    const inputVariant = tokens[variant] ? tokens[variant] : tokens.input
    const { density } = useEds()
    const _token = useToken({ density }, inputVariant)()

    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()
    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()

    const token = useCallback((): ComponentToken => {
      const leftAdornmentsWidth = leftAdornmentsRef
        ? leftAdornmentsRef.clientWidth
        : 0
      const rightAdornmentsWidth = rightAdornmentsRef
        ? rightAdornmentsRef.clientWidth
        : 0
      return {
        ..._token,
        spacings: {
          ..._token.spacings,
          left: `${leftAdornmentsWidth + parseInt(_token.spacings.left)}px`,
          right: `${rightAdornmentsWidth + parseInt(_token.spacings.right)}px`,
        },
      }
    }, [leftAdornmentsRef, rightAdornmentsRef, _token])()

    const inputProps = {
      ref,
      type,
      disabled,
      readOnly,
      token,
      style: {
        resize: 'none',
      },
      ...other,
    }

    const containerProps = {
      disabled,
      readOnly,
      className,
      style,
      token,
    }

    const _leftAdornmentProps = {
      ...leftAdornmentsProps,
      ref: setLeftAdornmentsRef,
      token,
    }
    const _rightAdornmentProps = {
      ...rightAdornmentsProps,
      ref: setRightAdornmentsRef,
      token,
    }

    return (
      // Not using <ThemeProvider> because of cascading styling messing with adornments
      <Container {...containerProps}>
        {leftAdornments ? (
          <Adornments position="left" {..._leftAdornmentProps}>
            {leftAdornments}
          </Adornments>
        ) : null}
        <StyledInput
          paddingLeft={token.spacings.left}
          paddingRight={token.spacings.right}
          {...inputProps}
        />
        {rightAdornments ? (
          <Adornments position="right" {..._rightAdornmentProps}>
            {rightAdornments}
          </Adornments>
        ) : null}
      </Container>
    )
  })
