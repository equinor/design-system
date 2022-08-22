import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useState,
  ForwardedRef,
  useCallback,
} from 'react'
import { InputWrapper } from '../InputWrapper'
import { Input } from '../Input'
import type { Variants } from './types'
import { useId } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'
import { Textarea } from '../Textarea'

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
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline?: boolean
  /**  Maximum number of rows if `multiline` is set to `true` */
  rowsMax?: number
  /** Input ref */
  inputRef?: ForwardedRef<HTMLInputElement>
  /** Textarea ref when multiline is set to `true` */
  textareaRef?: ForwardedRef<HTMLTextAreaElement>
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
      multiline = false,
      className,
      variant,
      inputRef,
      inputIcon,
      helperIcon,
      rowsMax,
      style,
      textareaRef,
      ...other
    },
    ref,
  ) {
    const helperTextId = useId(null, 'helpertext')

    const inputProps = {
      'aria-describedby': helperTextId,
      'aria-invalid': variant === 'error' || undefined,
      disabled,
      placeholder,
      id,
      variant,
      rightAdornments: (
        <>
          {inputIcon}
          <span>{unit}</span>
        </>
      ),
      ...other,
    }

    const textareaProps = {
      ...inputProps,
      rowsMax,
    }

    const helperProps = {
      id: helperTextId,
      text: helperText,
      icon: helperIcon,
      disabled,
    }

    const containerProps = {
      ref,
      className,
      style,
      color: variant,
    }

    const labelProps = {
      htmlFor: id,
      label,
      meta,
      disabled,
    }

    const { density } = useEds()

    return (
      <InputWrapper
        helperProps={helperProps}
        labelProps={labelProps}
        {...containerProps}
      >
        {multiline ? (
          <Textarea ref={textareaRef} {...textareaProps} />
        ) : (
          <Input ref={inputRef} {...inputProps} />
        )}
      </InputWrapper>
    )
  },
)
