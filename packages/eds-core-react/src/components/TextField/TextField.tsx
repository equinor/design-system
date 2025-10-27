import { InputHTMLAttributes, forwardRef, ForwardedRef } from 'react'
import {
  InputWrapper,
  useInputField,
  BaseInputFieldProps,
} from '../InputWrapper'
import { Input } from '../Input'

type TextFieldSpecificProps = {
  /** Unit text */
  unit?: string
  /** Input ref */
  inputRef?: ForwardedRef<HTMLInputElement>
}

export type TextFieldProps = BaseInputFieldProps &
  TextFieldSpecificProps &
  InputHTMLAttributes<HTMLInputElement>

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
      className,
      variant,
      inputIcon,
      helperIcon,
      style,
      inputRef,
      ...other
    },
    ref,
  ) {
    const { ariaProps, containerProps, labelProps, helperProps } =
      useInputField({
        id,
        label,
        meta,
        helperText,
        helperIcon,
        variant,
        disabled,
        className,
        style,
      })

    const hasRightAdornments = Boolean(unit || inputIcon)

    const fieldProps = {
      ...ariaProps,
      disabled,
      placeholder,
      variant,
      rightAdornments: hasRightAdornments && (
        <>
          {inputIcon}
          <span>{unit}</span>
        </>
      ),
      ref: ref || inputRef,
      ...other,
    }

    return (
      <InputWrapper
        helperProps={helperProps}
        labelProps={labelProps}
        {...containerProps}
      >
        <Input {...fieldProps} />
      </InputWrapper>
    )
  },
)
