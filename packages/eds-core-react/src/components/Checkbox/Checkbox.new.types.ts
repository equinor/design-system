import { InputHTMLAttributes, LabelHTMLAttributes } from 'react'

export type CheckboxProps = {
  /** Label for the checkbox */
  label?: string
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Important! You'll have to
   * set the native element to indeterminate yourself.
   */
  indeterminate?: boolean
  /** Error message to display below the checkbox. When set, the checkbox will be in error state. */
  errorLabel?: string
  /** Props to apply to the label element (when label prop is provided) */
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
} & InputHTMLAttributes<HTMLInputElement>
