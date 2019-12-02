import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { default as Input } from './Input'
import { default as Label } from './Label'
import { default as HelperText } from './HelperText'
import { TextFieldContext } from './context'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

class TextField extends React.Component {
  static contextType = TextFieldContext
  state = {
    isFocused: false,
  }
  updateIsFocused = (isFocused) => {
    this.setState({ ...this.state, isFocused })
  }
  render = () => {
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
      ...other
    } = this.props

    const inputProps = {
      multiline,
      disabled,
      placeholder,
      name,
      id,
      validation,
      compact,
      updateIsFocused: this.updateIsFocused,
      ...other,
    }

    const helperProps = {
      validation,
      helperText,
      compact,
    }

    const containerProps = {
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
        <TextFieldContext.Provider value={this.state}>
          <Label {...labelProps}></Label>
          <Input {...inputProps}></Input>
          <HelperText {...helperProps}></HelperText>
        </TextFieldContext.Provider>
      </Container>
    )
  }
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
