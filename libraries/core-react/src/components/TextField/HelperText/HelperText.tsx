import * as React from 'react'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate } from '@utils'
import { helperText as tokens } from './HelperText.token'
import { useTextField } from '../context'
import { Icon } from '../Icon'
import type { Variants, ColorStateProps } from '../types'
import type { Spacing } from '@equinor/eds-tokens'

type VariationProps = {
  variant: ColorStateProps
  isFocused: boolean
  isDisabled: boolean
}

const Variation = ({ variant, isFocused, isDisabled }: VariationProps) => {
  if (!variant) {
    return ``
  }

  const { focusColor, color, disabledColor } = variant

  if (isDisabled) {
    return css`
      color: ${disabledColor};
    `
  }

  if (isFocused) {
    return css`
      color: ${focusColor};
    `
  }

  return css`
    color: ${color};
  `
}

type StyledProps = {
  spacings: Spacing
}

const Container = styled.div<StyledProps>`
  display: flex;
  align-items: flex-end;
  margin-top: ${({ spacings }) => spacings.top};
`
const Text = styled.p<StyledProps & VariationProps>`
  ${typographyTemplate(tokens.typography)}
  margin: 0 0 0 ${({ spacings }) => spacings.left};
  ${Variation}
`

const StyledIcon = styled(Icon)<StyledProps>``

type TextfieldHelperTextProps = {
  /** Helper text */
  helperText?: string
  /** Icon */
  icon?: ReactNode
  /** Disabled */
  disabled?: boolean
  /** Variant */
  variant: Variants
}

const TextfieldHelperText = React.forwardRef<
  HTMLDivElement,
  TextfieldHelperTextProps
>(function TextfieldHelperText(
  { helperText, icon, variant = 'default', disabled: isDisabled, ...rest },
  ref,
) {
  const helperVariant = tokens[variant]
  const spacings = tokens.spacings.comfortable

  const { isFocused } = useTextField()

  const colors = {
    color: helperVariant.color,
    disabledColor: helperVariant.disabledColor,
    focusColor: helperVariant.focusColor,
  }

  return (
    <Container ref={ref} {...rest} spacings={spacings}>
      {icon && (
        <StyledIcon
          isDisabled={isDisabled}
          spacings={spacings}
          colors={colors}
          isInputIcon={false}
        >
          {icon}
        </StyledIcon>
      )}
      <Text
        variant={helperVariant}
        isFocused={isFocused}
        isDisabled={isDisabled}
        spacings={spacings}
      >
        {helperText}
      </Text>
    </Container>
  )
})

// HelperText.displayName = 'eds-text-field-helperText'

export { TextfieldHelperText as HelperText }
