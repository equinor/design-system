import { ReactNode, ComponentPropsWithoutRef } from 'react'

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
  /** Left adornments (icons, buttons, etc.) */
  leftAdornments?: ReactNode
  /** Right adornments (icons, buttons, etc.) */
  rightAdornments?: ReactNode
  /** Props for left adornments container */
  leftAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Props for right adornments container */
  rightAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Render as input or textarea */
  as?: 'input' | 'textarea'
  /** Additional CSS class names */
  className?: string
}
