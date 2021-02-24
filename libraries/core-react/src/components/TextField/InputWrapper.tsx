import * as React from 'react'
import { InputHTMLAttributes } from 'react'
import { useTextField } from './context'
import { Input } from '../Input'
import type { Variants } from './types'

type TextfieldInputProps = {
  /** Specifies if text should be bold */
  multiline?: boolean
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readonly?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const InputWrapper = React.forwardRef<
  HTMLInputElement,
  TextfieldInputProps
>(function InputWrapper({ multiline, variant, disabled, type, ...other }, ref) {
  const { handleFocus, handleBlur } = useTextField()

  const inputProps = {
    multiline,
    ref,
    type,
    disabled,
    variant,
    ...other,
  }

  return <Input onBlur={handleBlur} onFocus={handleFocus} {...inputProps} />
})
