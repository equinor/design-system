import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  input,
  area,
} from '@equinor/eds-tokens/components/text-fields/text-fields.json'
import { typographyTemplate, borderTemplate } from './../_common/templates'

const variants = ['input', 'area']
const variantTokens = {
  input,
  area,
}

const Base = ({ base }) => {
  const { spacings, field, clickbound } = base
  const { background, borders } = field
  return `
  margin: 0;
  border: none;
  background: ${background};

  ${borderTemplate(borders)}
  ${typographyTemplate(field.text.typography)}
  `
}

const TextFieldBase = styled.input`
  ${Base}
`

const TextField = ({ children, variant, ...other }) => {
  const base = variantTokens[variant]
  return (
    <TextFieldBase base={base} {...other}>
      {children}
    </TextFieldBase>
  )
}

TextField.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(variants),
  /** Specifies if text should be bold */
  multiline: PropTypes.bool,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Specifiec which type input is */
  type: PropTypes.oneOf('text', 'search', 'password', 'email', 'numbers'),
}

TextField.defaultProps = {
  variant: 'input',
  className: '',
}

TextField.displayName = 'eds-textfield'

export default TextField
