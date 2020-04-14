import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Input } from './Input'
import { Label } from './Label'
import { HelperText } from './HelperText'
import { propsFor, TextFieldProvider } from './context'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {typeof propsFor.variants[number]} [variant] Variant
 * @prop {string} id Input unique id
 * @prop {string} [label] Label text
 * @prop {string} [meta] Meta text
 * @prop {string} [helperText] Helper text
 * @prop {string} [placeholder] Placeholder text
 * @prop {boolean} [disabled] Disabled
 * @prop {boolean} [multiline] Multiline input
 * @prop {Function | object} [inputRef] Input ref
 * @prop {React.ReactElement} [inputIcon] InputIcon
 * @prop {React.ReactElement} [helperIcon] HelperIcon
 */

const TextField = React.forwardRef(
  /**
   * @param {Props & React.InputHTMLAttributes<HTMLInputElement>} props
   * @param ref
   */
  function TextField(props, ref) {
    const {
      id,
      label,
      meta,
      helperText,
      placeholder,
      disabled,
      multiline,
      className,
      variant,
      inputRef,
      inputIcon,
      helperIcon,
      ...other
    } = props

    const inputProps = {
      multiline,
      disabled,
      placeholder,
      id,
      variant,
      ref: inputRef,
      inputIcon,
      ...other,
    }

    const helperProps = {
      variant,
      helperText,
      icon: helperIcon,
      disabled,
    }

    const containerProps = {
      ref,
      className,
    }

    const labelProps = {
      inputId: id,
      label,
      meta,
    }

    const showLabel = label || meta
    const showHelperText = helperText

    return (
      <Container {...containerProps}>
        <TextFieldProvider>
          {showLabel && <Label {...labelProps} />}
          <Input {...inputProps} />
          {showHelperText && <HelperText {...helperProps} />}
        </TextFieldProvider>
      </Container>
    )
  },
)

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
  multiline: false,
  inputRef: null,
  inputIcon: null,
  helperIcon: null,
}
TextField.displayName = 'eds-text-field'

// @ts-ignore
TextField.constants = {
  variants: propsFor.variants,
  // @ts-ignore
  types: Input.constants.types,
}

export { TextField }
