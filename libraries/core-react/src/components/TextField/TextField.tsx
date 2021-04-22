import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from 'react'
import styled from 'styled-components'
import { InputWrapper } from './InputWrapper'
import { Label } from '../Label'
import { HelperText } from './HelperText'
import { TextFieldProvider } from './context'
import type { Variants } from './types'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

export type TextFieldProps = {
  /** @ignore */
  className?: string
  /** Variants */
  variant?: Variants
  /** Input unique id */
  id: string
  /** Label text */
  label?: string
  /** Meta text */
  meta?: string
  /** Unit text */
  unit?: string
  /** Helper text */
  helperText?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled */
  disabled?: boolean
  /** Multiline input */
  multiline?: boolean
  /** Input ref */
  inputRef?: React.Ref<HTMLInputElement>
  /** InputIcon */
  inputIcon?: ReactNode
  /** HelperIcon */
  helperIcon?: ReactNode
  /** Value */
  value?: string
  /** Read Only */
  readOnly?: boolean
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      meta,
      unit,
      helperText,
      placeholder,
      disabled,
      multiline,
      className,
      variant = 'default',
      inputRef,
      inputIcon,
      helperIcon,
      ...other
    },
    ref,
  ) {
    const inputProps = {
      multiline,
      disabled,
      placeholder,
      id,
      variant,
      ref: inputRef,
      inputIcon,
      unit,
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
      htmlFor: id,
      label,
      meta,
      disabled,
    }

    const showLabel = label || meta
    const showHelperText = helperText

    return (
      <Container {...containerProps}>
        <TextFieldProvider>
          {showLabel && <Label {...labelProps} />}
          <InputWrapper {...inputProps} />
          {showHelperText && <HelperText {...helperProps} />}
        </TextFieldProvider>
      </Container>
    )
  },
)
