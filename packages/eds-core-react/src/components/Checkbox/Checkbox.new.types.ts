import { InputHTMLAttributes } from 'react'

export type CheckboxProps = {
  /** Label for the checkbox */
  label?: string
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Important! You'll have to
   * set the native element to indeterminate yourself.
   */
  indeterminate?: boolean
} & InputHTMLAttributes<HTMLInputElement>
