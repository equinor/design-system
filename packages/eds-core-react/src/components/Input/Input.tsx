import {
  forwardRef,
  ReactNode,
  useState,
  useCallback,
  CSSProperties,
  ElementType,
  ComponentPropsWithoutRef,
  InputHTMLAttributes,
} from 'react'
import styled, { css } from 'styled-components'
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

const Container = styled.div<StyledProps>(({ $token, disabled, readOnly }) => {
  const { states, entities } = $token

  return css`
    --eds-input-adornment-color: ${entities.adornment.typography.color};
    --eds-input-color: ${$token.typography.color};

    position: relative;
    height: ${$token.height};
    width: ${$token.width};
    display: flex;
    flex-direction: row;
    border: none;
    box-sizing: border-box;
    box-shadow: ${$token.boxShadow};
    background: var(--eds-input-background, ${$token.background});
    ${outlineTemplate($token.outline)}

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
    & > input {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `
})

const StyledInput = styled.input<StyledProps>(
  ({ $token, $paddingLeft, $paddingRight }) => {
    return css`
      width: 100%;
      border: none;
      background: transparent;
      ${spacingsTemplate($token.spacings)}
      ${typographyMixin($token.typography)}
      outline: none;

      padding-left: ${$paddingLeft};
      padding-right: ${$paddingRight};

      &::placeholder {
        color: ${$token.entities.placeholder.typography.color};
      }

      &:disabled {
        color: var(--eds-input-color);
        cursor: not-allowed;
      }
    `
  },
)

type AdornmentProps = {
  $token: InputToken
}

const Adornments = styled.div<AdornmentProps>(({ $token }) => {
  return css`
    position: absolute;
    top: ${$token.spacings.top};
    bottom: ${$token.spacings.bottom};
    display: flex;
    align-items: center;
    ${typographyMixin($token.entities.adornment.typography)}
    color: var(--eds-input-adornment-color);
  `
})

const LeftAdornments = styled(Adornments)(
  ({ $token }) => css`
    left: 0;
    padding-left: ${$token.entities.adornment.spacings.left};
  `,
)

const RightAdornments = styled(Adornments)(
  ({ $token }) => css`
    right: 0;
    padding-right: ${$token.entities.adornment.spacings.right};
  `,
)

type StyledProps = {
  $token: InputToken
  $paddingLeft?: string
  $paddingRight?: string
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
  /** Manually specify left adornments width. The width will be the dom element width if not defined */
  leftAdornmentsWidth?: number
  /**  Manually specify right adornments width. The width will be the dom element width if not defined */
  rightAdornmentsWidth?: number
  /** Cast the input to another element */
  as?: ElementType
  /**  */
  className?: string
  style?: CSSProperties
}

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<
    HTMLInputElement,
    InputProps & InputHTMLAttributes<HTMLInputElement>
  >(function Input(
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
      leftAdornmentsWidth,
      rightAdornmentsWidth,
      as = 'input',
      ...other
    },
    ref,
  ) {
    const inputVariant = tokens[variant] ? tokens[variant] : tokens.input
    const { density } = useEds()
    const _token = useToken({ density }, inputVariant)() as InputToken

    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()
    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()

    const token = useCallback((): InputToken => {
      const _leftAdornmentsWidth =
        leftAdornmentsWidth ||
        (leftAdornmentsRef ? leftAdornmentsRef.clientWidth : 0)
      const _rightAdornmentsWidth =
        rightAdornmentsWidth ||
        (rightAdornmentsRef ? rightAdornmentsRef.clientWidth : 0)
      return {
        ..._token,
        spacings: {
          ..._token.spacings,
          left: `${_leftAdornmentsWidth + parseInt(_token.spacings.left)}px`,
          right: `${_rightAdornmentsWidth + parseInt(_token.spacings.right)}px`,
        },
      }
    }, [
      leftAdornmentsWidth,
      leftAdornmentsRef,
      rightAdornmentsWidth,
      rightAdornmentsRef,
      _token,
    ])()

    const inputProps = {
      ref,
      type,
      disabled,
      readOnly,
      $token: token,
      style: {
        resize: 'none' as const,
      },
      ...other,
    }

    const containerProps = {
      disabled,
      readOnly,
      className,
      style,
      $token: token,
    }

    const _leftAdornmentProps = {
      ...leftAdornmentsProps,
      ref: setLeftAdornmentsRef,
      $token: token,
    }
    const _rightAdornmentProps = {
      ...rightAdornmentsProps,
      ref: setRightAdornmentsRef,
      $token: token,
    }

    return (
      // Not using <ThemeProvider> because of cascading styling messing with adornments
      <Container {...containerProps}>
        {leftAdornments ? (
          <LeftAdornments {..._leftAdornmentProps}>
            {leftAdornments}
          </LeftAdornments>
        ) : null}
        <StyledInput
          $paddingLeft={token.spacings.left}
          $paddingRight={token.spacings.right}
          {...inputProps}
        />
        {rightAdornments ? (
          <RightAdornments {..._rightAdornmentProps}>
            {rightAdornments}
          </RightAdornments>
        ) : null}
      </Container>
    )
  })
