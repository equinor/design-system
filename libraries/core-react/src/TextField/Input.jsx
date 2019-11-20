import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  input,
  area,
} from '@equinor/eds-tokens/components/text-fields/text-fields.json'
import { typographyTemplate, borderTemplate } from '../_common/templates'

const variants = ['input', 'area']
const variantTokens = {
  input,
  area,
}

const Base = ({ base }) => {
  const { field, clickbound, active, focus } = base
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
  width: 100%;
  box-sizing: border-box;
  ${Base}
`

const TextField = ({ children, variant, ...other }) => {
  const base = variantTokens[variant]
  return (
    <Input base={base} type="text" {...other}>
      {children}
    </Input>
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
  type: PropTypes.oneOf(['text', 'search', 'password', 'email', 'numbers']),
}

TextField.defaultProps = {
  variant: 'input',
  className: '',
}

TextField.displayName = 'eds-textfield'

export default TextField
