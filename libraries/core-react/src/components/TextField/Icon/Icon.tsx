import * as React from 'react'
import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { useTextField } from '../context'
import { input as tokens } from './Icon.token'
import type { Spacing } from '@equinor/eds-tokens'
import type { Variants, ColorStateProps } from '../types'

type StyledIconProps = {
  colors: ColorStateProps
  isDisabled?: boolean
  isFocused?: boolean
  spacings: Spacing
}

const Variation = ({ colors, isDisabled, isFocused }: StyledIconProps) => {
  const { focusColor, color, disabledColor } = colors

  if (isDisabled) {
    return css`
      &,
      svg {
        fill: ${disabledColor};
      }
    `
  }
  if (isFocused) {
    return css`
      &,
      svg {
        fill: ${focusColor};
      }
    `
  }
  return css`
    &,
    svg {
      fill: ${color};
    }
  `
}

const StyledIcon = styled.div<StyledIconProps>`
  &,
  svg {
    width: 16px;
    height: 16px;
  }
  ${Variation}
`

const StyledIputIcon = styled(StyledIcon)`
  position: absolute;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};
`

type TextfieldIconProps = {
  /** isDisabled */
  isDisabled?: boolean
  /** Variant */
  variant?: Variants
  /** Is the icon inside a text field */
  isInputIcon?: boolean
  /** Spacing object, comfortable is default */
  spacings?: Spacing
  /** Colors */
  colors?: ColorStateProps
} & HTMLAttributes<HTMLDivElement>

const InputIcon = React.forwardRef<HTMLDivElement, TextfieldIconProps>(
  function InputIcon(
    {
      variant = 'default',
      isDisabled = false,
      isInputIcon = true,
      spacings = tokens.spacings.comfortable,
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
      spacings,
      isDisabled,
      colors,
      isFocused,
    }

    return (
      <>
        {isInputIcon ? (
          <StyledIputIcon ref={ref} {...iconProps} {...other}>
            {children}
          </StyledIputIcon>
        ) : (
          <StyledIcon ref={ref} {...iconProps} {...other}>
            {children}
          </StyledIcon>
        )}
      </>
    )
  },
)

export { InputIcon as Icon }
