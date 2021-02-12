import * as React from 'react'
import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { useTextField } from '../context'
import { input as tokens } from './Icon.token'
import type { Spacing } from '@equinor/eds-tokens'
import type { Variants, ColorStateProps } from '../types'

type StyledIconProps = {
  color: string
  focusColor: string
  disabledColor: string
  isDisabled?: boolean
  isFocused?: boolean
  spacings: Spacing
}

const Variation = ({
  color,
  focusColor,
  disabledColor,
  isDisabled,
  isFocused,
}: StyledIconProps) => {
  if (isDisabled) {
    return css`
      fill: ${disabledColor};
    `
  }
  if (isFocused) {
    return css`
      fill: ${focusColor};
    `
  }
  return css`
    fill: ${color};
  `
}

const StyledIcon = styled.div<StyledIconProps>`
  width: 16px;
  height: 16px;
  ${Variation}
`

const StyledInlineIcon = styled(StyledIcon)`
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
  inputIcon?: boolean
  /** Spacing object */
  spacings: Spacing
  /** Colors */
  colors: ColorStateProps
} & HTMLAttributes<HTMLDivElement>

const InputIcon = React.forwardRef<HTMLDivElement, TextfieldIconProps>(
  function InputIcon(
    {
      variant = 'default',
      isDisabled = false,
      inputIcon = false,
      children,
      ...other
    },
    ref,
  ) {
    const { isFocused } = useTextField()

    const inputVariant = tokens[variant]
    const spacings = tokens.spacings.comfortable

    const iconProps = {
      spacings: spacings,
      isDisabled,
      color: inputVariant.color,
      disabledColor: inputVariant.disabledColor,
      focusColor: inputVariant.focusColor,
    }

    return (
      <>
        {inputIcon ? (
          <StyledInlineIcon
            ref={ref}
            isFocused={isFocused}
            {...iconProps}
            {...other}
          >
            {children}
          </StyledInlineIcon>
        ) : (
          <StyledIcon ref={ref} isFocused={isFocused} {...iconProps} {...other}>
            {children}
          </StyledIcon>
        )}
      </>
    )
  },
)

// Icon.displayName = 'eds-text-field-icon'

export { InputIcon as Icon }
