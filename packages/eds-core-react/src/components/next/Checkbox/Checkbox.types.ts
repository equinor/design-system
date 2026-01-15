import { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from 'react'

export type CheckboxProps = {
  /** Label for the checkbox */
  label?: string
  /** If true, the checkbox will be disabled */
  disabled?: boolean
  /** If true, the checkbox appears indeterminate. Important! You'll have to
   * set the native element to indeterminate yourself.
   */
  indeterminate?: boolean
  /** If true, the checkbox will be in error state with red styling */
  error?: boolean
  /** Props to apply to the label element (when label prop is provided) */
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  /** Props to apply to the wrapper element (span when no label, label when label is provided).
   * Use this to override default data-attributes like data-color-appearance, data-selectable-space, etc.
   */
  wrapperProps?: HTMLAttributes<HTMLElement>
} & InputHTMLAttributes<HTMLInputElement>
