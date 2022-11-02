import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  ForwardedRef,
} from 'react'
import { useId } from '@equinor/eds-utils'
import { InputWrapper } from '../InputWrapper'
import { Input } from '../Input'
import { Textarea } from '../Textarea'
import type { Variants } from '../types'

type FieldProps = SharedTextFieldProps &
  React.HTMLAttributes<HTMLTextAreaElement | HTMLInputElement>
/** Proxy component for working around typescript and element type switching */
const Field = forwardRef<HTMLTextAreaElement | HTMLInputElement, FieldProps>(
  function Field(props, ref) {
    return props.multiline ? (
      <Textarea ref={ref as ForwardedRef<HTMLTextAreaElement>} {...props} />
    ) : (
      <Input ref={ref as ForwardedRef<HTMLInputElement>} {...props} />
    )
  },
)

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
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline?: boolean
}

export type TextFieldProps = SharedTextFieldProps &
  (
    | TextareaHTMLAttributes<HTMLTextAreaElement>
    | InputHTMLAttributes<HTMLInputElement>
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

    let fieldProps = {
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
      rowsMax,
      ref: inputRef || textareaRef,
      multiline,
      ...other,
    }

    let helperProps = {
      id: null,
      text: helperText,
      icon: helperIcon,
      disabled,
    }

    const containerProps = {
      ref,
      className,
      style: {
        width: '100%',
        ...style,
      },
      color: variant,
    }

    const labelProps = {
      htmlFor: id,
      label,
      meta,
      disabled,
    }

    if (helperText) {
      fieldProps = {
        'aria-describedby': helperTextId,
        ...fieldProps,
      }
      helperProps = {
        ...helperProps,
        id: helperTextId,
      }
    }

    return (
      <InputWrapper
        helperProps={helperProps}
        labelProps={labelProps}
        {...containerProps}
      >
        <Field {...fieldProps} />
      </InputWrapper>
    )
  },
)
