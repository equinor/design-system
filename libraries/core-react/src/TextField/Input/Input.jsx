import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { tokens } from './Input.tokens'
import { typographyTemplate } from '../../_common/templates'
import { TextFieldContext } from '../context'

const Variation = ({ variant }) => {
  if (!variant) {
    return ``
  }

  const { focus, border, borderBottom } = variant

  return `
  border-bottom: 1px solid ${borderBottom};
  outline: ${border.width} solid ${border.color};

  &:active,
  &:focus {
    outline-offset:0;
    border-bottom: 1px solid transparent;
    outline: ${focus.border.width} solid ${focus.border.color};

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

const IconVariation = ({ variant, isDisabled, isFocused }) => {
  if (!variant) {
    return ``
  }

  const { icon, focus } = variant

  if (isDisabled) {
    return `
    fill: ${icon.disabledColor};
    `
  }

  if (isFocused) {
    return `
    fill: ${focus.icon.color};
    `
  }
  return `
  fill: ${icon.color};
`
}

const InputBase = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;

  display:grid;
  grid-template-columns: repeat(2, 1fr);

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

const Icon = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  right: ${({ spacings }) => spacings.right};
  top: ${({ spacings }) => spacings.top};
  bottom: ${({ spacings }) => spacings.bottom};

  ${IconVariation}
`

const Input = React.forwardRef(function TextFieldInput(props, ref) {
  const {
    children,
    multiline,
    variant,
    updateIsFocused,
    compact,
    inputIcon,
    disabled,
    textField,
    ...other
  } = props

  const as = multiline ? 'textarea' : 'input'
  const variant_ = tokens[variant]
  let spacings = compact ? tokens.spacings.compact : tokens.spacings.comfortable

  if (inputIcon) {
    spacings = {
      ...spacings,
      input: {
        ...spacings.input,
        right: '32px',
      },
    }
  }

  return (
    <Container>
      <InputBase
        as={as}
        onBlur={() => updateIsFocused(false)}
        onFocus={() => updateIsFocused(true)}
        ref={ref}
        spacings={spacings.input}
        type="text"
        variant={variant_}
        disabled={disabled}
        {...other}
      ></InputBase>
      {inputIcon && (
        <Icon
          spacings={spacings.icon}
          variant={variant_}
          isDisabled={disabled}
          isFocused={textField.isFocused}
        >
          {inputIcon}
        </Icon>
      )}
    </Container>
  )
})

Input.propTypes = {
  /** Specifies if text should be bold */
  multiline: PropTypes.bool,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Specifiec which type input is */
  type: PropTypes.oneOf(['text', 'search', 'password', 'email', 'number']),
  /** Multiline input */
  multiline: PropTypes.bool,
  /** Textfield state */
  textField: PropTypes.object,
}

Input.defaultProps = {
  className: '',
  multiline: false,
  label: '',
  placeholder: '',
}

Input.displayName = 'text-field-input'

export { Input }
