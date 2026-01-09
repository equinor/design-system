import { ReactNode } from 'react'

export type InputProps = {
  /** Placeholder text */
  placeholder?: string
  /** Invalid state - shows error styling */
  invalid?: boolean
  /** Disables element */
  disabled?: boolean
  /** Input type (e.g., "text", "number", "email", "password") */
  type?: string
  /** Toggle read only state */
  readOnly?: boolean
  /** Text prefix on the left (e.g., "$", "USD") - always neutral color */
  leftText?: string
  /** Adornment on the left (icons, buttons, etc.) - inherits state color (red when invalid) */
  leftAdornment?: ReactNode
  /** Text suffix on the right (e.g., "km", "%") - always neutral color */
  rightText?: string
  /** Adornment on the right (icons, buttons, etc.) - inherits state color (red when invalid) */
  rightAdornment?: ReactNode
  /** Render as input or textarea */
  as?: 'input' | 'textarea'
  /** Additional CSS class names */
  className?: string
}
