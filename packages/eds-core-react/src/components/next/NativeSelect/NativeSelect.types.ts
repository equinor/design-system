import type { ReactNode, SelectHTMLAttributes } from 'react'
import type { SelectOptionProps } from '../utils/SelectOption.types'

export type NativeSelectProps<T = string> = {
  /** Label for the field */
  label?: ReactNode
  /** Descriptive text providing additional context */
  description?: ReactNode
  /** Helper or validation message shown below the select */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
  /** Marks the field as invalid */
  invalid?: boolean
  /** Makes the field read-only — visible but not editable */
  readOnly?: boolean
} & Omit<SelectOptionProps<T>, 'renderOption'> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>
