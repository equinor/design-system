import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import typography from '@equinor/eds-tokens/components/text-fields/text-fields.json'
import { typographyTemplate } from './../_common/templates'

const variants = ['']

const Base = ({ typography, link }) => {
  let base = `
  margin: 0;

  `

  return base
}

const TextFieldBase = styled.input`
  ${Base}
`

const TextField = ({ children, ...other }) => {
  return <TextFieldBase {...other}>{children}</TextFieldBase>
}

TextField.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
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
  variant: 'h1',
  className: '',
}

TextField.displayName = 'eds-textfield'

export default TextField
