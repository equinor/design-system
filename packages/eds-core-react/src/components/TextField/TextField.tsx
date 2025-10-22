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

type FieldProps = SharedTextFieldProps & {
  $multiline: boolean
} & React.HTMLAttributes<HTMLTextAreaElement | HTMLInputElement>
/** Proxy component for working around typescript and element type switching */
const Field = forwardRef<HTMLTextAreaElement | HTMLInputElement, FieldProps>(
  function Field(props, ref) {
    return props.$multiline ? (
      <Textarea ref={ref as ForwardedRef<HTMLTextAreaElement>} {...props} />
    ) : (
      <Input ref={ref as ForwardedRef<HTMLInputElement>} {...props} />
    )
  },
)

type SharedTextFieldProps = {
  /** Variants */
  variant?: Variants
  /** Input unique id. If this is not provided, one will be generated */
  id?: string
  /** Label text */
  label?: ReactNode
  /** Meta text */
  meta?: ReactNode
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

type TextFieldInputProps = SharedTextFieldProps & {
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline?: false
} & InputHTMLAttributes<HTMLInputElement>

type TextFieldTextareaProps = SharedTextFieldProps & {
  /** If `true` a `textarea` is rendered for multiline support. Make sure to use `textareaRef` if you need to access reference element  */
  multiline: true
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export type TextFieldProps = TextFieldInputProps | TextFieldTextareaProps

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id: _id,
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
    const id = useId(_id, 'input')
    const helperTextId = useId(null, 'helpertext')
    const hasRightAdornments = Boolean(unit || inputIcon)
    let fieldProps = {
      'aria-invalid': variant === 'error' || undefined,
      disabled,
      placeholder,
      id,
      variant,
      rightAdornments: hasRightAdornments && (
        <>
          {inputIcon}
          <span>{unit}</span>
        </>
      ),
      rowsMax,
      ref: ref || inputRef || textareaRef,
      $multiline: multiline,
      ...other,
    }

    let helperProps = {
      id: null,
      text: helperText,
      icon: helperIcon,
      disabled,
    }

    const containerProps = {
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
