import type { ReactNode, SelectHTMLAttributes } from 'react'
import type { SelectOptionProps } from '../utils/SelectOption.types'

/** A group of options rendered as a native `<optgroup>` */
export type SelectOptionGroup<T = string> = {
  /** Label for the option group */
  label: string
  /** Options within this group */
  options: T[]
}

export type SelectProps<T = string> = {
  /** Label for the field */
  label?: ReactNode
  /** Indicator text shown after the label, e.g. "(Required)" or "(Optional)" */
  indicator?: string
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
  /**
   * Placeholder text shown as the first, non-selectable option when no value
   * is pre-selected. Renders as a disabled `<option value="">` at the top of the list.
   */
  placeholder?: string
  /** Options to display — either flat or grouped via `SelectOptionGroup` */
  options?: (T | SelectOptionGroup<T>)[]
} & Omit<SelectOptionProps<T>, 'renderOption' | 'options'> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>
