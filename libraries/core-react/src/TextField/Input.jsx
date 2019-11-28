import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import base from '@equinor/eds-tokens/base'
import { typographyTemplate, borderTemplate } from '../_common/templates'

const { colors } = base
const spacings = {
  left: '12px',
  right: '12px',
}

console.log(JSON.stringify(base))

const Input = styled.input`
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;

  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  padding-top: 6px;
  padding-bottom: 6px;

  border: 1px solid #fff;
  border-bottom: 1px solid #efefef;

  &:focus {
  }
  &:active {
  }

  &:disabled {
    cursor: not-allowed;

    &:active {
      outline: none;
    }
  }
`

const TextField = ({ children, variant, multiline, validation, ...other }) => {
  const as = multiline ? 'textarea' : 'input'

  return (
    <Input as={as} type="text" {...other}>
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
