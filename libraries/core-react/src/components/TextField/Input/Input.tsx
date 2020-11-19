import * as React from 'react'
import { ReactNode, ElementType, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { InputVariantProps, input as tokens } from './Input.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
} from '../../../_common/templates'
import { useTextField } from '../context'
import { Icon } from '../Icon'
import type { Variants } from '../types'
import type { Spacing } from '@equinor/eds-tokens'

const Variation = ({ variant }: { variant: InputVariantProps }) => {
  if (!variant) {
    return ``
  }

  const {
    focus: { border: focusBorderOutline },
    border: { outline: borderOutline, bottom: borderBottom },
  } = variant

  return css`
    border-bottom: ${borderBottom.width} solid ${borderBottom.color};
    outline: ${borderOutline.width} solid ${borderOutline.color};

    &:active,
    &:focus {
      outline-offset: 0;
      border-bottom: 1px solid transparent;
      outline: ${focusBorderOutline.width} solid ${focusBorderOutline.color};
    }

    &:disabled {
      cursor: not-allowed;
      border-bottom: 1px solid transparent;
      outline: none;

      &:focus,
      &:active {
        outline: none;
      }
    }
  `
}

type StyledProps = {
  spacings: Spacing
  variant: InputVariantProps
}

const StyledInput = styled.input<StyledProps>`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;

  background: ${tokens.background};

  ${({ spacings }) => spacingsTemplate(spacings)}
  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

  ${Variation}
`

const Container = styled.div`
  position: relative;
`

type StyledIconProps = {
  spacings: Spacing
}

const StyledIcon = styled(Icon)<StyledIconProps>`
  position: absolute;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};
`

type TextfieldInputProps = {
  /** Specifies if text should be bold */
  multiline?: boolean
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Icon to be embeded in input field */
  inputIcon?: ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readonly?: boolean
} & InputHTMLAttributes<HTMLInputElement>

const TextFieldInput = React.forwardRef<HTMLInputElement, TextfieldInputProps>(
  function TextFieldInput(
    {
      multiline = false,
      variant = 'default',
      inputIcon,
      disabled = false,
      type = 'text',
      ...other
    },
    ref,
  ) {
    const { handleFocus, handleBlur } = useTextField()

    const as: ElementType = multiline ? 'textarea' : 'input'
    const inputVariant = tokens[variant]
    let spacings = tokens.spacings.comfortable

    if (inputIcon) {
      spacings = {
        ...spacings,
        input: {
          ...spacings.input,
          right: '32px',
        },
      }
    }

    const iconProps = {
      spacings: spacings.icon,
      isDisabled: disabled,
      color: inputVariant.icon.color,
      disabledColor: inputVariant.icon.disabledColor,
      focusColor: inputVariant.focus.icon.color,
    }

    const inputProps = {
      as,
      ref,
      type,
      disabled,
      variant: inputVariant,
      spacings: spacings.input,
      ...other,
    }

    return (
      <Container>
        <StyledInput
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...inputProps}
        />
        {inputIcon && <StyledIcon {...iconProps}>{inputIcon}</StyledIcon>}
      </Container>
    )
  },
)

// Input.displayName = 'eds-text-field-input'

export { TextFieldInput as Input }
