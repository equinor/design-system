import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  input,
  area,
} from '@equinor/eds-tokens/components/text-fields/text-fields.json'
import { typographyTemplate, borderTemplate } from '../_common/templates'

const variantTokens = {
  input,
  textarea: area,
}

const { danger, warning, success } = input
const states = {
  danger,
  warning,
  success,
}

const Base = ({ base }) => {
  const { enabled, active, focus } = base
  const { field } = enabled
  const { background, borders, spacings } = field
  return `
  margin: 0;
  border: none;
  background: ${background};


  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  padding-top: 6px;
  padding-bottom: 6px;

  ${borderTemplate(borders)}
  ${typographyTemplate(field.text.typography)}

  &:focus {
    ${borderTemplate(focus.field.borders)}
  }
  &:active {
    ${borderTemplate(active.field.borders)}

  }

  &:disabled {
    cursor: not-allowed;

    &:active {
      outline: none;
    }
  }

  `
}

const Input = styled.input`
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  ${Base}
`

const TextField = ({ children, variant, multiline, validation, ...other }) => {
  const as = multiline ? 'textarea' : 'input'
  const base = variantTokens[as]
  const state = states[validation]

  return (
    <Input as={as} base={base} type="text" {...other}>
      {children}
    </Input>
  )
}

TextField.propTypes = {
  /** Specifies if text should be bold */
  multiline: PropTypes.bool,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Specifiec which type input is */
  type: PropTypes.oneOf(['text', 'search', 'password', 'email', 'numbers']),
  /** Multiline input */
  multiline: PropTypes.bool,
  /** Validation state */
  validation: PropTypes.oneOf(['error', 'warning', 'success']),
}

TextField.defaultProps = {
  variant: 'default',
  className: '',
}

TextField.displayName = 'eds-textfield'

export default TextField
