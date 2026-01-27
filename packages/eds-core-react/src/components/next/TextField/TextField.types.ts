import { ReactNode } from 'react'
import type { InputProps } from '../Input/Input.types'

export type TextFieldProps = {
  /** Label for the field */
  label?: ReactNode
  /** Info tooltip content shown next to the label */
  labelInfo?: ReactNode
  /** Indicator text shown after label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
  /** Descriptive text that provides additional context for the field */
  description?: ReactNode
  /** Helper or validation message shown below the input */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
} & InputProps
