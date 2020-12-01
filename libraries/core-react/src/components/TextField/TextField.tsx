import * as React from 'react'
import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styled from 'styled-components'
import { Input } from './Input'
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

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      meta,
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

// TextField.displayName = 'eds-text-field'
