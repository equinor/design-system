import type { InputHTMLAttributes, ReactNode } from 'react'

export type CheckboxProps = {
  /** Label for the checkbox */
  label?: ReactNode
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Note: You must also set
   * the native element's indeterminate property via ref if needed.
   */
  indeterminate?: boolean
  /** If true, the checkbox will be in error state with red styling */
  error?: boolean
  /** Indicator text shown after the label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
