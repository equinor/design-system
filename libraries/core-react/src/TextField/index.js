import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { default as Input } from './Input'
import { default as Label } from './Label'
import { default as HelperText } from './HelperText'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

const TextField = (props) => {
  const {
    id,
    label,
    meta,
    helperText,
    name,
    placeholder,
    disabled,
    style,
    multiline,
    className,
    validation,
    ...other
  } = props

  const inputProps = {
    multiline,
    disabled,
    placeholder,
    name,
    id,
    validation,
    ...other,
  }

  const helperProps = {
    validation,
    helperText,
  }

  const containerProps = {
    className,
  }

  return (
    <Container {...containerProps}>
      <Label inputId={id} label={label} meta={meta}></Label>
      <Input {...inputProps}></Input>
      <HelperText {...helperProps}></HelperText>
    </Container>
  )
}

TextField.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Input unique id */
  id: PropTypes.string.isRequired,
  /** Label text */
  label: PropTypes.string,
  /** Meta text */
  meta: PropTypes.string,
  /** Helper text */
  helperText: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Disabled */
  disabled: PropTypes.bool,
  /** Multiline input */
  multiline: PropTypes.bool,
}

TextField.defaultProps = {
  className: '',
  placeholder: '',
  helperText: '',
  label: '',
  meta: '',
  disabled: false,
}
TextField.displayName = 'text-field'

export default TextField
