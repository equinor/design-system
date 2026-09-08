import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'

export type CheckboxProps = {
  /** Label for the checkbox */
  label?: ReactNode
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Note: You must also set
   * the native element's indeterminate property via ref if needed.
   */
  indeterminate?: boolean
  /** Indicator text shown after the label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
  /** Helper message shown below the checkbox, useful for additional context */
  helperMessage?: ReactNode
<<<<<<< HEAD
  /** Custom class name, merged onto the native input element together with
   * the internal 'input' class */
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
=======
  /** CSS class names applied to the outer wrapper element, not the hidden input */
  className?: string
  /** Inline styles applied to the outer wrapper element, not the hidden input */
  style?: CSSProperties
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'style'>
>>>>>>> afae78b8e (fix: address review feedback on selection controls className fix)
