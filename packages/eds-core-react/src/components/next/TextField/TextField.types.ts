import { ReactNode, InputHTMLAttributes } from 'react'
import type { InputProps } from '../Input/Input.types'

export type TextFieldProps = {
  /** Label for the field */
  label?: ReactNode
  /** Mark field as optional - shows "(Optional)" */
  optional?: boolean
  /** Mark field as required - shows "(Required)" and sets required on input */
  required?: boolean
  /** Mark field as required without showing indicator - only sets required on input */
  requiredSilent?: boolean
  /** Descriptive text that provides additional context for the field */
  description?: ReactNode
  /** Validation or helper message shown below the input */
  validationMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
} & InputProps &
  InputHTMLAttributes<HTMLInputElement>
