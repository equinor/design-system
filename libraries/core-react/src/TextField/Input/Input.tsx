import React, { ReactNode } from 'react'
import styled, { AnyStyledComponent, css } from 'styled-components'
import { InputVariantProps, input as tokens } from './Input.tokens'
import {
  Spacing,
  typographyTemplate,
  spacingsTemplate,
} from '../../_common/templates'
import { useTextField } from '../context'
import { Icon } from '../Icon'
import type { Variants } from '../TextField.types'

type typeProps = 'text' | 'search' | 'password' | 'email' | 'number'

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

const StyledIcon = styled(Icon)<StyledProps>`
  position: absolute;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};
`

type Props = {
  /** @ignore */
  className: string
  /** Specifies if text should be bold */
  multiline: boolean
  /** Input label */
  label: string
  /** Placeholder */
  placeholder: string
  /** Specifiec which type input is */
  type: typeProps
  /** Variant */
  variant: Variants
  /** Icon to be embeded in input field */
  inputIcon: ReactNode
  /** Disabled state */
  disabled: boolean
}

const Input = React.forwardRef<HTMLInputElement, Props>(function TextFieldInput(
  props,
  ref,
) {
  const {
    multiline = false,
    variant = 'default',
    inputIcon,
    disabled = false,
    type = 'text',
    ...other
  } = props

  const { handleFocus, handleBlur } = useTextField()

  const as: string = multiline ? 'textarea' : 'input'
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
      <StyledInput onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
      {inputIcon && <StyledIcon {...iconProps}>{inputIcon}</StyledIcon>}
    </Container>
  )
})

Input.defaultProps = {
  className: '',
  multiline: false,
  label: '',
  placeholder: '',
  type: 'text',
  variant: 'default',
  inputIcon: null,
  disabled: false,
}

Input.displayName = 'eds-text-field-input'

export { Input }
