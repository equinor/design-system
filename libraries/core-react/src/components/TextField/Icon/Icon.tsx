import { HTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { useTextField } from '../TextField.context'
import { input as tokens } from './Icon.tokens'
import type { Variants, ColorStateProps } from '../types'

type StyledIconProps = {
  colors: ColorStateProps
  isDisabled?: boolean
  isFocused?: boolean
  size?: 16 | 24
}

const StyledIcon = styled.div<StyledIconProps>(
  ({ colors, isDisabled, isFocused, size }) => {
    const { focusColor, color, disabledColor } = colors
    let fill = color

    if (isDisabled) {
      fill = disabledColor
    }
    if (isFocused) {
      fill = focusColor
    }

    return css`
      &,
      svg {
        fill: ${fill};
        width: ${size}px;
        height: ${size}px;
      }
    `
  },
)

type TextfieldIconProps = {
  /** isDisabled */
  isDisabled?: boolean
  /** Variant */
  variant?: Variants
  /** Colors */
  colors?: ColorStateProps
  /** Size */
  size?: 16 | 24
} & HTMLAttributes<HTMLDivElement>

const InputIcon = forwardRef<HTMLDivElement, TextfieldIconProps>(
  function InputIcon(
    {
      size = 24,
      variant = 'default',
      isDisabled = false,
      colors = {
        color: tokens[variant].color,
        disabledColor: tokens[variant].disabledColor,
        focusColor: tokens[variant].focusColor,
      },
      children,
      ...other
    },
    ref,
  ) {
    const { isFocused } = useTextField()

    const iconProps = {
      isDisabled,
      colors,
      isFocused,
      size,
    }

    return (
      <StyledIcon ref={ref} {...iconProps} {...other}>
        {children}
      </StyledIcon>
    )
  },
)

export { InputIcon as Icon }
