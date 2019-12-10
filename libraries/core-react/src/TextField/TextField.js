import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextFieldInput } from './src/Input'
import { Label } from './src/Label'
import { HelperText } from './src/HelperText'
import { TextFieldContext, initalState, propsFor } from './src/context'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

const TextField = React.forwardRef(function TextField(props, ref) {
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
    variant,
    compact,
    inputRef,
    inputIcon,
    helperIcon,
    ...other
  } = props

  const [state, setState] = useState(initalState)

  const inputProps = {
    multiline,
    disabled,
    placeholder,
    name,
    id,
    variant,
    compact,
    ref: inputRef,
    updateIsFocused: (isFocused) => setState({ ...state, isFocused }),
    inputIcon,
    ...other,
  }

  const helperProps = {
    variant,
    helperText,
    compact,
    icon: helperIcon,
    disabled,
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

  const showLabel = label || meta
  const showHelperText = helperText

  return (
    <Container {...containerProps}>
      <TextFieldContext.Provider value={state}>
        {showLabel && <Label {...labelProps}></Label>}
        <TextFieldInput {...inputProps}></TextFieldInput>
        {showHelperText && <HelperText {...helperProps}></HelperText>}
      </TextFieldContext.Provider>
    </Container>
  )
})

TextField.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Variant */
  variant: PropTypes.oneOf(propsFor.variants),
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
  /** InputIcon */
  inputIcon: PropTypes.element,
  /** HelperIcon */
  helperIcon: PropTypes.element,
}

TextField.defaultProps = {
  className: '',
  placeholder: '',
  helperText: '',
  label: '',
  meta: '',
  disabled: false,
  variant: 'default',
}
TextField.displayName = 'text-field'

export { TextField }
