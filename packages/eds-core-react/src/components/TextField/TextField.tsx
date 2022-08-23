import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react'
import { InputWrapper } from '../InputWrapper'
import { Input } from '../Input'
import type { Variants } from './types'
import { useId } from '@equinor/eds-utils'
import { Textarea } from '../Textarea'

type SharedTextFieldProps = {
  /** Variants */
  variant?: Variants
  /** Input unique id. This is required to ensure accesibility */
  id: string
  /** Label text */
  label?: string
  /** Meta text */
  meta?: string
  /** Unit text */
  unit?: string
  /** Helper text */
  helperText?: string
  /** InputIcon */
  inputIcon?: ReactNode
  /** HelperIcon */
  helperIcon?: ReactNode
  /**  Maximum number of rows if `multiline` is set to `true` */
  rowsMax?: number
  /** Input ref */
  inputRef?: ForwardedRef<HTMLInputElement>
  /** Textarea ref when multiline is set to `true` */
  textareaRef?: ForwardedRef<HTMLTextAreaElement>
}

export type TextFieldProps = SharedTextFieldProps &
  (
    | ({
        /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
        multiline: true
      } & TextareaHTMLAttributes<HTMLTextAreaElement>)
    | ({
        /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
        multiline?: false
      } & InputHTMLAttributes<HTMLInputElement>)
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
      inputIcon,
      helperIcon,
      style,
      rowsMax,
      textareaRef,
      inputRef,
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

    const textAreaProps = {
      rowsMax,
      ...inputProps,
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

    return (
      <InputWrapper
        helperProps={helperProps}
        labelProps={labelProps}
        {...containerProps}
      >
        {multiline ? (
          <Textarea ref={textareaRef} {...textAreaProps} />
        ) : (
          <Input ref={inputRef} {...inputProps} />
        )}
      </InputWrapper>
    )
  },
)
