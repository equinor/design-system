import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { input as tokens } from './Input.tokens'
import { typographyTemplate } from '../../_common/templates'
import { propsFor, useTextField } from '../context'
import { Icon } from '../Icon'

const typeProps = ['text', 'search', 'password', 'email', 'number']

const Variation = ({ variant }) => {
  if (!variant) {
    return ``
  }

  const {
    focus: { border: focusBorderOutline },
    border: { outline: borderOutline, bottom: borderBottom },
  } = variant

  return `
  border-bottom: ${borderBottom.width} solid ${borderBottom.color};
  outline: ${borderOutline.width} solid ${borderOutline.color};

  &:active,
  &:focus {
    outline-offset:0;
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

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;

  background: ${tokens.background};
  padding-left: ${({ spacings }) => spacings.left};
  padding-right: ${({ spacings }) => spacings.right};
  padding-top: ${({ spacings }) => spacings.top};
  padding-bottom: ${({ spacings }) => spacings.bottom};

  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

  ${Variation}
`

const Container = styled.div`
  position: relative;
`

const StyledIcon = styled(Icon)`
  position: absolute;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};
`

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {boolean} [multiline] Specifies if text should be bold
 * @prop {string} [label] Input label
 * @prop {string} [placeholder] Placeholder
 * @prop {typeof typeProps[number]} [type] Specific which type input is
 * @prop {typeof propsFor.variants[number]} [variant] Variant
 * @prop {React.ReactElement} [inputIcon] Icon to be embedded in input field
 * @prop {boolean} [disabled] Disabled state
 */

const Input = React.forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function TextFieldInput(props, ref) {
    const { multiline, variant, inputIcon, disabled, ...other } = props

    const { handleFocus, handleBlur } = useTextField()

    const as = multiline ? 'textarea' : 'input'
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

    return (
      <Container>
        <StyledInput
          as={as}
          ref={ref}
          disabled={disabled}
          onBlur={handleBlur}
          onFocus={handleFocus}
          variant={inputVariant}
          spacings={spacings.input}
          {...other}
        />
        {inputIcon && <StyledIcon {...iconProps}>{inputIcon}</StyledIcon>}
      </Container>
    )
  },
)

Input.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Specifies if text should be bold */
  multiline: PropTypes.bool,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Specifiec which type input is */
  type: PropTypes.oneOf(typeProps),
  /** Variant */
  variant: PropTypes.oneOf(propsFor.variants),
  /** Icon to be embeded in input field */
  inputIcon: PropTypes.element,
  /** Disabled state */
  disabled: PropTypes.bool,
}

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

// @ts-ignore
Input.constants = {
  types: typeProps,
}

export { Input }
