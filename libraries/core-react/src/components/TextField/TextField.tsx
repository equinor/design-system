import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  Ref,
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
  /** Specifies max rows for multiline input */
  rowsMax?: number
  /** Input ref */
  inputRef?: Ref<HTMLInputElement> | Ref<HTMLTextAreaElement>
  /** InputIcon */
  inputIcon?: ReactNode
  /** HelperIcon */
  helperIcon?: ReactNode
  /** Value */
  value?: string
  /** Read Only */
  readOnly?: boolean
} & (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
)

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
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
      rowsMax,
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
      ref: inputRef as Ref<HTMLInputElement>,
      inputIcon,
      unit,
      rowsMax,
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

    const textareaProps = {
      ...inputProps,
      ref: inputRef as Ref<HTMLTextAreaElement>,
    }

    const showLabel = label || meta
    const showHelperText = helperText

    return (
      <Container {...containerProps}>
        <TextFieldProvider>
          {showLabel && <Label {...labelProps} />}
          {multiline ? (
            <InputWrapper {...textareaProps} />
          ) : (
            <InputWrapper {...inputProps} />
          )}
          {showHelperText && <HelperText {...helperProps} />}
        </TextFieldProvider>
      </Container>
    )
  },
)
