import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { default as Input } from './Input'
import { default as Label } from './Label'
import { default as HelperText } from './HelperText'
import { TextFieldContext, initalState } from './context'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

const TextField = React.forwardRef((props, ref) => {
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
    compact,
    inputRef,
    ...other
  } = props

  const [state, setState] = useState(initalState)

  const inputProps = {
    multiline,
    disabled,
    placeholder,
    name,
    id,
    validation,
    compact,
    ref: inputRef,
    updateIsFocused: (isFocused) => setState({ ...state, isFocused }),
    ...other,
  }

  const helperProps = {
    validation,
    helperText,
    compact,
  }

  const containerProps = {
    ref,
    className,
    compact,
  }

  const labelProps = {
    inputId: id,
    label,
    meta,
    compact,
  }

  return (
    <Container {...containerProps}>
      <TextFieldContext.Provider value={state}>
        {(label || meta) && <Label {...labelProps}></Label>}
        <Input {...inputProps}></Input>
        {helperText && <HelperText {...helperProps}></HelperText>}
      </TextFieldContext.Provider>
    </Container>
  )
})

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
  /** Input ref */
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
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
