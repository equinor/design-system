import type { InputHTMLAttributes, ReactNode } from 'react'
import type { ColorAppearance } from '../types'

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
  /** Color appearance for the checkbox icon. Defaults to 'accent' */
  'data-color-appearance'?: ColorAppearance
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
