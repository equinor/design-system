import type { ReactNode } from 'react'
import type { InputProps } from '../Input/Input.types'

/**
 * A single autocomplete option.
 * Pass an array of strings or objects with a custom `optionLabel`.
 */
export type AutocompleteOption = string

export type AutocompleteProps = {
  /** Label for the field */
  label?: ReactNode
  /** Descriptive text providing additional context */
  description?: ReactNode
  /** Helper or validation message shown below the input */
  helperMessage?: ReactNode
  /** Unique identifier for the field */
  id?: string
  /** List of options to display in the dropdown */
  options: string[]
  /** Currently selected option value */
  selectedOption?: string
  /** Callback fired when an option is selected */
  onOptionSelect?: (option: string) => void
  /** Text shown when no options match the search value */
  noOptionsText?: string
} & Omit<
  InputProps,
  | 'startAdornment'
  | 'endAdornment'
  | 'startText'
  | 'endText'
  | 'as'
  | 'hideErrorIcon'
  | 'type'
>
